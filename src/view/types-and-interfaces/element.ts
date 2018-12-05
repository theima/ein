import { EventHandler } from './event-handler';
import { ViewEvent } from './view-event';
import { Observable } from 'rxjs';
import { Attribute } from './attribute';

export interface Element {
  name: string;
  id: string;
  attributes: Attribute[];
  content: Array<Element | string>;
  eventHandlers?: EventHandler[];
  eventStream?: Observable<ViewEvent>;
}
