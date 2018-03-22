import { EventHandler } from '../../view/types-and-interfaces/event-handler';
import { Property } from '../../view/types-and-interfaces/property';
import { TemplateString } from './template-string';
import { DynamicProperty } from './dynamic-property';

export interface TemplateElement {
  name: string;
  properties: Property[];
  dynamicProperties: DynamicProperty[];
  content: Array<TemplateElement | TemplateString>;
  id?: string;
  eventHandlers?: EventHandler[];
}
