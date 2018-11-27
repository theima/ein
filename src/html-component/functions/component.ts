import { HtmlComponentElementData } from '../types-and-interfaces/html-component-element-data';
import { Select, TemplateElement } from '../../view';
import { Observable, Subject } from 'rxjs';
import { SetNativeElementLookup } from '../../view/types-and-interfaces/set-native-element-lookup';
import { NativeElementReferenceSelect } from '../types-and-interfaces/native-element-reference-select';
import { Selector } from '../../view/types-and-interfaces/selector';
import { createSelector } from '../../view/functions/create-selector';
import { Dict } from '../../core';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { mapContent } from '../../view/functions/element-map/map-content';
import { ModelToElementOrNull } from '../../view/types-and-interfaces/model-to-element-or-null';
import { ModelToElements } from '../../view/types-and-interfaces/model-to-elements';
import { map } from 'rxjs/operators';
import { NativeElementSelect } from '../types-and-interfaces/native-element-select';

export function component<T>(name: string,
                             template: string,
                             tempComponentInitiator: (
                               select: Select,
                               nativeElementSelect: NativeElementSelect<T>,
                               updateTemplate: () => void
                             ) => (attributes: Dict<string | number | boolean>) => Dict<string | number | boolean>): HtmlComponentElementData<T> {

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

  const createStream = (content: Array<TemplateElement | ModelToString>,
                        attributes: Observable<Dict<string | number | boolean>>,
                        createMaps: (elements: Array<TemplateElement | ModelToString>) => Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                        select: Select) => {
    const updates: Subject<Dict<string | number | boolean>> = new Subject<Dict<string | number | boolean>>();
    let lastAttributes: Dict<string | number | boolean> = {};
    const update = () => {
      updates.next(lastAttributes);
    };
    attributes.subscribe(a => {
      lastAttributes = a;
      update();
    });

    const attributeMap = tempComponentInitiator(select, nativeElementSelect, update);
    return updates.pipe(
      map(
        (attributes => {
          if (attributeMap) {
            attributes = attributeMap(attributes);
          }
          const contentMaps = createMaps(content);// todo: slot must be handled.
          return mapContent(contentMaps, attributes);
        })
      )
    );
  };

  let data: HtmlComponentElementData<T> = {
    name,
    content: template,
    setElementLookup,
    createStream
  };

  return data;
}
