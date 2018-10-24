import { HtmlComponentElementData } from '../types-and-interfaces/html-component-element-data';
import { Select, ViewEvent } from '../../view';
import { Observable, Subject } from 'rxjs';
import { SetNativeElementLookup } from '../../view/types-and-interfaces/set-native-element-lookup';
import { NativeElementSelect } from '../types-and-interfaces/native-element-select';
import { Selector } from '../../view/types-and-interfaces/selector';
import { createSelector } from '../../view/functions/create-selector';
import { NativeElementStreams } from '../types-and-interfaces/native-element-streams';

export function component<T>(name: string,
                             template: string,
                             getNativeElements: (getElement: (selector: string) => NativeElementStreams<T>) => void,
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
  getNativeElements(addSelect);
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
  let data: HtmlComponentElementData<T> = {
    name,
    content: template,
    setElementLookup
  };
  if (events) {
    data.events = events;
  }

  return data;
}
