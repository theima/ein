import { Attribute } from './attribute';
import { EventHandler } from './event-handler';
import { ViewEvent } from './view-event';
import { Observable } from 'rxjs/Observable';

export interface Element {
  name: string;
  attributes: Attribute[];
  content: Array<Element | string>;
  eventHandlers?: EventHandler[];
  eventStream?: Observable<ViewEvent>;
}
