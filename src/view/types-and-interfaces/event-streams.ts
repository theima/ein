import { Observable } from 'rxjs';
import { ViewEvent } from './view-event';
import { ViewEventSource } from './view-event-source';

export interface EventStreams {
  select: (selector: string, type: string) => Observable<ViewEvent & ViewEventSource>;
}
