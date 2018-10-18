import { EventHandler } from './event-handler';
import { ViewEvent } from './view-event';
import { Observable } from 'rxjs';
import { Attribute } from './attribute';
import { NativeElementLookup } from './native-element-lookup';

export interface Element {
  name: string;
  attributes: Attribute[];
  content: Array<Element | string>;
  eventHandlers?: EventHandler[];
  eventStream?: Observable<ViewEvent>;
  setElementLookup?: NativeElementLookup;
}
