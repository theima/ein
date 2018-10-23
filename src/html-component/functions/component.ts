import { HtmlComponentElementData } from '../types-and-interfaces/html-component-element-data';
import { Select, ViewEvent } from '../../view';
import { Observable, Subject } from 'rxjs';
import { SetNativeElementLookup } from '../../view/types-and-interfaces/set-native-element-lookup';
import { NativeElementSelect } from '../types-and-interfaces/native-element-select';
import { Selector } from '../../view/types-and-interfaces/selector';
import { createSelector } from '../../view/functions/create-selector';

export function component<T>(name: string,
                             template: string,
                             nativeElements: (getElement: (selector: string) => Observable<T[]>) => void,
                             events?: (select: Select) => Observable<ViewEvent>): HtmlComponentElementData {

  let selects: Array<NativeElementSelect<T>> = [];
  const addSelect = (selectorString: string) => {
    const selector = createSelector(selectorString);
    const nativeElements: Subject<T[]> = new Subject<T[]>();
    const newSelect: NativeElementSelect<T> = {
      selector,
      nativeElements
    };
    selects = [...selects, newSelect];
    return nativeElements;
  };
  nativeElements(addSelect);
  let setElementLookup: SetNativeElementLookup<T> = (lookup: (selector: Selector) => T[]) => {
    selects.forEach(
      (s: NativeElementSelect<T>) => {
        const matches = lookup(s.selector);
        if (matches.length) {
          s.nativeElements.next(matches);
        }
      }
    );
  };
  let data: HtmlComponentElementData = {
    name,
    content: template,
    setElementLookup
  };
  if (events) {
    data.events = events;
  }

  return data;
}
