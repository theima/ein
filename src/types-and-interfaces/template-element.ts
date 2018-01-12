import {EventHandler} from './event-handler';
import {Attribute} from './attribute';

export interface TemplateElement {
  tag: string;
  children: Array<TemplateElement | string>;
  id?: string;
  eventHandlers?: EventHandler[];
  attributes?: Attribute[];
}
