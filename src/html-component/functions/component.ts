import { HtmlComponentElementData } from '../types-and-interfaces/html-component-element-data';
import { Select, ViewEvent, TemplateElement } from '../../view';
import { Observable, Subject } from 'rxjs';
import { SetNativeElementLookup } from '../../view/types-and-interfaces/set-native-element-lookup';
import { NativeElementSelect } from '../types-and-interfaces/native-element-select';
import { Selector } from '../../view/types-and-interfaces/selector';
import { createSelector } from '../../view/functions/create-selector';
import { NativeElementStreams } from '../types-and-interfaces/native-element-streams';
import { Dict } from '../../core';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { mapContent } from '../../view/functions/element-map/map-content';
import { ModelToElementOrNull } from '../../view/types-and-interfaces/model-to-element-or-null';
import { ModelToElements } from '../../view/types-and-interfaces/model-to-elements';
import { map } from 'rxjs/operators';

export function component<T>(name: string,
                             template: string,
                             tempComponentInitiator: (
                               getNativeElements: (selector: string) => NativeElementStreams<T>,
                               attributes: Observable<Dict<string | number | boolean>>
                             ) => void,
                             events?: (select: Select) => Observable<ViewEvent>): HtmlComponentElementData<T> {

  let selects: Array<NativeElementSelect<T>> = [];
  const addSelect = (selectorString: string) => {
    const selector = createSelector(selectorString);
    const added: Subject<T[]> = new Subject<T[]>();
    const removed: Subject<T[]> = new Subject<T[]>();
    const streams = {
      added,
      removed
    };
    const newSelect: NativeElementSelect<T> = {
      selector,
      added,
      removed
    };
    selects = [...selects, newSelect];
    return streams;
  };

  let setElementLookup: SetNativeElementLookup<T> = (lookup: (selector: Selector) => T[]) => {
    const newSelects: Array<NativeElementSelect<T>> = [];
    selects.forEach(
      (s: NativeElementSelect<T>) => {
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
                        createMaps: (elements: Array<TemplateElement | ModelToString>) => Array<ModelToElementOrNull | ModelToString | ModelToElements>) => {
    tempComponentInitiator(addSelect, attributes);
    return attributes.pipe(
      map(
        (attributes => {
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
  if (events) {
    data.events = events;
  }

  return data;
}
