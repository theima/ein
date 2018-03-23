import { EventHandler } from '../../view';
import { TemplateString } from './template-string';
import { Attribute } from './attribute';

export interface TemplateElement {
  name: string;
  attributes: Attribute[];
  dynamicAttributes: Attribute[];
  content: Array<TemplateElement | TemplateString>;
  id?: string;
  eventHandlers?: EventHandler[];
}
