import { ModelToString } from './model-to-string';
import { DynamicAttribute } from './dynamic-attribute';
import { Attribute } from './attribute';

export interface TemplateElement {
  name: string;
  attributes: Array<Attribute | DynamicAttribute>;
  content: Array<TemplateElement | ModelToString>;
}
