import { Observable } from 'rxjs/Observable';
import { ViewEvent } from './view-event';

export interface EventStreams {
  select: (id: string, type: string) => Observable<ViewEvent>;
}
