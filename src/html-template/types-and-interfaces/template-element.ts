import { EventHandler } from '../../view/types-and-interfaces/event-handler';
import { Property } from '../../view/types-and-interfaces/property';
import { TemplateString } from './template-string';
import { DynamicProperty } from '../../view/types-and-interfaces/dynamic-property';
import { Template } from '../../view/types-and-interfaces/template';

export interface TemplateElement {
  name: string;
  properties: Property[];
  dynamicProperties: DynamicProperty[];
  content: Array<TemplateElement | TemplateString>;
  id?: string;
  eventHandlers?: EventHandler[];
}
