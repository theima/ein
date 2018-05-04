import { Property } from './property';
import { EventHandler } from './event-handler';
import { ViewEvent } from './view-event';
import { Observable } from 'rxjs/Observable';

export interface RenderInfo {
  name: string;
  properties: Property[];
  content: Array<RenderInfo | string>;
  eventHandlers?: EventHandler[];
  eventStream?: Observable<ViewEvent>;
}
