import { DynamicProperty } from './dynamic-property';
import { ElementTemplateContent } from './element-template-content';
import { Property } from './property';

export interface ElementTemplate {
  name: string;
  properties: Array<Property | DynamicProperty>;
  content:  ElementTemplateContent[];
}
