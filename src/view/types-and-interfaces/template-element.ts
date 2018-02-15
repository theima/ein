import { EventHandler } from './event-handler';
import { Property } from './property';
import { TemplateString } from './template-string';
import { DynamicProperty } from './dynamic-property';

export interface TemplateElement {
  tag: string;
  properties: Property[];
  dynamicProperties: DynamicProperty[];
  children: Array<TemplateElement | TemplateString>;
  id?: string;
  eventHandlers?: EventHandler[];
}
