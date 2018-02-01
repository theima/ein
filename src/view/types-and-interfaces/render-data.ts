import { DynamicProperty } from './dynamic-property';
import { Property } from './property';
import { TemplateString } from './template-string';
import { TemplateValidator } from './template-validator';
import { EventHandler } from './event-handler';
import { ModelMap } from './model-map';

export interface RenderData {
  tag: string;
  id?: string;
  properties: Property[];
  dynamicProperties: DynamicProperty[];
  children: Array<RenderData | TemplateString>;
  templateValidator: TemplateValidator;
  modelMap: ModelMap;
  eventHandlers?: EventHandler[];
}
