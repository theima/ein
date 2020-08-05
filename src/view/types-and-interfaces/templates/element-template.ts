
import { DynamicProperty } from '../dynamic-property';
import { Property } from '../property';
import { ElementTemplateContent } from './element-template-content';

export interface ElementTemplate {
  name: string;
  properties: Array<Property | DynamicProperty>;
  content:  ElementTemplateContent;
}
