import { Template } from '../../html-template/types-and-interfaces/template';
import { ModelToString } from './model-to-string';
import { Attribute } from './attribute';
import { ModelToAttribute } from './model-to-attribute';

export interface TemplateElement {
  name: string;
  attributes: Array<Attribute | ModelToAttribute>;
  content: Array<TemplateElement | ModelToString>;
  show?: Template;
}
