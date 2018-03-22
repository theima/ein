import { EventHandler } from '../../view/types-and-interfaces/event-handler';
import { Property } from '../../view/types-and-interfaces/property';
import { TemplateString } from './template-string';
import { Attribute } from './attribute';

export interface TemplateElement {
  name: string;
  attributes: Property[];
  dynamicAttributes: Attribute[];
  content: Array<TemplateElement | TemplateString>;
  id?: string;
  eventHandlers?: EventHandler[];
}
