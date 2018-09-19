import { Observable, Subject } from 'rxjs/index';
import { EventStreams, ViewEvent } from '../../index';
import { EventSelect } from '../interfaces/event-select';
import { createSelector } from './create-selector';
import { ViewEventSource } from '../../types-and-interfaces/view-event-source';

export function selectEvents(selector: (subscribe: EventStreams) => Observable<ViewEvent>): { selects: EventSelect[], stream: Observable<ViewEvent> } {
  let selects: EventSelect[] = [];
  const select: (selector: string, type: string) => Observable<ViewEvent & ViewEventSource> = (selector: string, type: string): Observable<ViewEvent & ViewEventSource> => {
    const subject: Subject<ViewEvent & ViewEventSource> = new Subject<ViewEvent & ViewEventSource>();
    selects.push(
      {
        subject,
        selector: createSelector(selector),
        type
      }
    );
    return subject;
  };
  const fake: EventStreams = {
    select
  };
  const stream = selector(fake);
  return {selects, stream};
}
