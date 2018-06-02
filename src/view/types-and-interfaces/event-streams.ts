import { Observable } from 'rxjs';
import { ViewEvent } from './view-event';

export interface EventStreams {
  select: (selector: string, type: string) => Observable<ViewEvent>;
}
