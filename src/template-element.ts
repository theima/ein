import {ViewEvent} from './types-and-interfaces/view-event';
import {EventHandler} from './types-and-interfaces/event-handler';

export interface TemplateElement {
  tag: string;
  children: Array<TemplateElement | string>;
  id?: string;
  eventHandlers?: EventHandler[];
}
