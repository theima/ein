import { EventHandler } from './event-handler';
import { Property } from './property';
import { TemplateString } from './template-string';
import { DynamicProperty } from './dynamic-property';
import { Template } from './template';

export interface TemplateElement {
  name: string;
  properties: Property[];
  dynamicProperties: DynamicProperty[];
  content: Array<TemplateElement | TemplateString>;
  id?: string;
  eventHandlers?: EventHandler[];
}
