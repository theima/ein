import { DynamicProperty } from './dynamic-property';
import { Property } from './property';
import { TemplateString } from './template-string';

export interface RenderData {
  tag: string;
  id?: string;
  properties: Property[];
  dynamicProperties: DynamicProperty[];
  children: Array<RenderData | TemplateString>;
}
