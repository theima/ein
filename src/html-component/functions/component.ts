import { HtmlComponentElementData } from '../types-and-interfaces/html-component-element-data';
import { Select, TemplateElement, ViewEvent } from '../../view';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { SetNativeElementLookup } from '../../view/types-and-interfaces/set-native-element-lookup';
import { NativeElementReferenceSelect } from '../types-and-interfaces/native-element-reference-select';
import { Selector } from '../../view/types-and-interfaces/selector';
import { createSelector } from '../../view/functions/create-selector';
import { arrayToDict, Dict } from '../../core';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { mapContent } from '../../view/functions/element-map/map-content';
import { ModelToElementOrNull } from '../../view/types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../view/types-and-interfaces/elements/model-to-elements';
import { map } from 'rxjs/operators';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { InitiateComponent } from '../types-and-interfaces/initiate-component';

export function component<T>(name: string,
                             template: string,
                             initiateComponent: InitiateComponent<T>): HtmlComponentElementData<T> {
  const createComponent = (content: Array<TemplateElement | ModelToString>,
                           createMaps: (elements: Array<TemplateElement | ModelToString>) => Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                           select: Select) => {
    let selects: Array<NativeElementReferenceSelect<T>> = [];
    const nativeElementSelect = (selectorString: string) => {
      const selector = createSelector(selectorString);
      const added: Subject<T[]> = new Subject<T[]>();
      const removed: Subject<T[]> = new Subject<T[]>();
      const streams = {
        added,
        removed
      };
      const newSelect: NativeElementReferenceSelect<T> = {
        selector,
        added,
        removed
      };
      selects = [...selects, newSelect];
      return streams;
    };

    let setElementLookup: SetNativeElementLookup<T> = (lookup: (selector: Selector) => T[]) => {
      const newSelects: Array<NativeElementReferenceSelect<T>> = [];
      selects.forEach(
        (s: NativeElementReferenceSelect<T>) => {
          const matches = lookup(s.selector);
          const last = s.last || [];
          newSelects.push({...s, last: matches});
          let newMatches = matches.filter(n => !last.includes(n));
          if (newMatches.length) {
            s.added.next(newMatches);
          }
          const oldMatches = last.filter(n => !matches.includes(n));
          if (oldMatches.length) {
            s.removed.next(oldMatches);
          }
        }
      );
      selects = newSelects;
    };
    let lastAttributes: Attribute[] = [];
    const updateChildren = (attributes: Attribute[]) => {
      lastAttributes = attributes;
      const attrDict = arrayToDict(a => a.value, 'name', attributes);
      attributeStream.next(attrDict as any);
    };
    let attributeStream: ReplaySubject<Dict<string | number | boolean>> = new ReplaySubject<Dict<string | number | boolean>>(1);

    const update = () => {
      updateChildren(lastAttributes);
    };
    const c = initiateComponent(select, nativeElementSelect, update);
    let attributeMap: (attributes: Dict<string | number | boolean>) => Dict<string | number | boolean> = a => a;
    attributeMap = c.map || attributeMap;
    const eventStream = c.events || new Observable<ViewEvent>();
    const contentMaps = createMaps(content);// todo: slot must be handled.
    const completeStream = () => {
      if (attributeStream) {
        attributeStream.complete();
      }
    };
    const onDestroy = () => {
      if (c.onBeforeDestroy) {
        c.onBeforeDestroy();
      }
      completeStream();
    };
    const stream = attributeStream.pipe(
      map(
        (attributes => {
          if (attributeMap) {
            attributes = attributeMap(attributes);
          }
          return mapContent(contentMaps, attributes);
        })
      )
    );
    return {
      stream,
      updateChildren,
      onDestroy,
      eventStream,
      setElementLookup
    };
  };

  let data: HtmlComponentElementData<T> = {
    name,
    content: template,
    createComponent
  };

  return data;
}
