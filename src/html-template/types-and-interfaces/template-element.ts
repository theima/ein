import { EventHandler } from '../../view';
import { TemplateString } from './template-string';
import { TemplateAttribute } from './template-attribute';
import { Attribute } from './attribute';
import { Template } from './template';

export interface TemplateElement {
  name: string;
  attributes: Attribute[];
  dynamicAttributes: TemplateAttribute[];
  content: Array<TemplateElement | TemplateString>;
  eventHandlers?: EventHandler[];
  show?: Template;
}
