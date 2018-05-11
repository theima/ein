import { ModelToString } from './model-to-string';
import { DynamicAttribute } from './dynamic-attribute';
import { Attribute } from './attribute';
import { InsertContentAt } from './insert-content-at';

export interface TemplateElement {
  name: string;
  attributes: Array<Attribute | DynamicAttribute>;
  content: Array<TemplateElement | ModelToString | InsertContentAt>;
}
