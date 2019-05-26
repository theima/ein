import { Select, TemplateElement } from '../view';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { SetNativeElementLookup } from './types-and-interfaces/set-native-element-lookup';
import { NativeElementReferenceSelect } from './types-and-interfaces/native-element-reference-select';
import { Selector } from '../view/types-and-interfaces/selector';
import { createSelector } from '../view/functions/create-selector';
import { Action, arrayToDict, Dict } from '../core';
import { ModelToString } from '../view/types-and-interfaces/model-to-string';
import { mapContent } from '../view/functions/element-map/map-content';
import { ModelToElementOrNull } from '../view/types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../view/types-and-interfaces/elements/model-to-elements';
import { map } from 'rxjs/operators';
import { Property } from '../view/types-and-interfaces/property';
import { InitiateComponent } from './types-and-interfaces/initiate-component';
import { FilledSlot } from '../view/types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../view/types-and-interfaces/slots/mapped.slot';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { HtmlElementData } from '../html-template/types-and-interfaces/html-element-data';

export function component<T>(name: string,
                             template: string,
                             initiateComponent: InitiateComponent<T>): HtmlElementData {
  const createComponent = (id: string,
                           content: Array<TemplateElement | ModelToString | FilledSlot>,
                           createMaps: (elements: Array<TemplateElement | ModelToString | FilledSlot>) => Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>,
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
    let lastAttributes: Property[] = [];
    let lastModel: object = {};
    const updateChildren = (attributes: Property[], model: object) => {
      lastAttributes = attributes;
      lastModel = model;
      const attrDict = arrayToDict(a => a.value, 'name', attributes);
      attributeStream.next({attributes: attrDict as any, model});
    };
    let attributeStream: ReplaySubject<{ attributes: Dict<string | number | boolean>; model: object }> = new ReplaySubject<{ attributes: Dict<string | number | boolean>; model: object }>(1);

    const update = () => {
      updateChildren(lastAttributes, lastModel);
    };
    const c = initiateComponent(select, nativeElementSelect, update);
    let attributeMap: (attributes: Dict<string | number | boolean>) => Dict<string | number | boolean> = a => a;
    attributeMap = c.map || attributeMap;
    const actionStream = c.actions || new Observable<Action>();
    const contentMaps = createMaps(content);// todo: slot must be handled.
    const completeStream = () => {
      if (attributeStream) {
        attributeStream.complete();
      }
    };
    const onDestroy = () => {
      if (c.onBeforeDestroy) {
        setElementLookup(() => []);
        c.onBeforeDestroy();
      }
      completeStream();
    };
    const stream = attributeStream.pipe(
      map(
        (data => {
          let attributes = data.attributes;
          if (attributeMap) {
            attributes = attributeMap(attributes);
          }
          return mapContent(id, contentMaps, attributes, data.model);
        })
      )
    );
    return {
      stream,
      updateChildren,
      onDestroy,
      actionStream,
      setElementLookup
    };
  };

  let data: HtmlElementData = {
    name,
    children: template,
    properties: [{name: BuiltIn.Component, value: createComponent}]
  };

  return data;
}