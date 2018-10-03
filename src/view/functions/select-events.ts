import { Observable, Subject } from 'rxjs/index';
import { ViewEvent } from '../index';
import { EventSelect } from '../types-and-interfaces/event-select';
import { createSelector } from './create-selector';
import { Select } from '../types-and-interfaces/select';

export function selectEvents(selector: (select: Select) => Observable<ViewEvent>): { selects: EventSelect[], stream: Observable<ViewEvent > } {
  let selects: EventSelect[] = [];
  const select: Select = (selector: string, type: string) => {
    const subject: Subject<ViewEvent> = new Subject<ViewEvent>();
    selects.push(
      {
        subject,
        selector: createSelector(selector),
        type
      }
    );
    return subject;
  };
  const stream = selector(select);
  return {selects, stream};
}
