import { EventStreams } from '../types-and-interfaces/event-streams';
import { Observable, Subject } from 'rxjs';
import { ViewEvent } from '../types-and-interfaces/view-event';
import { Element } from '../types-and-interfaces/element';
import { EventSelect } from './interfaces/event-select';
import { createSelector } from './functions/create-selector';
import { ViewEventSource } from '../types-and-interfaces/view-event-source';
import { process } from './functions/process';

export class EventStreamManager implements EventStreams {
  private selects: EventSelect[];
  private processor!: (root: Element) => Element;
  constructor() {
    this.selects = [];

  }

  public select(selector: string, type: string): Observable<ViewEvent & ViewEventSource> {
    const subject: Subject<ViewEvent & ViewEventSource> = new Subject<ViewEvent & ViewEventSource>();
    this.selects.push(
      {
        subject,
        selector: createSelector(selector),
        type
      }
    );
    return subject;
  }

  public process(root: Element): Element {
    if (!this.processor) {
      this.processor = process(this.selects);
    }
    return this.processor(root);
  }

}
