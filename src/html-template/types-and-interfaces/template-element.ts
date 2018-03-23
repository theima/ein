import { EventHandler } from '../../view';
import { TemplateString } from './template-string';
import { TemplateAttribute } from './template-attribute';
import { Attribute } from './attribute';

export interface TemplateElement {
  name: string;
  attributes: Attribute[];
  dynamicAttributes: TemplateAttribute[];
  content: Array<TemplateElement | TemplateString>;
  id?: string;
  eventHandlers?: EventHandler[];
}
