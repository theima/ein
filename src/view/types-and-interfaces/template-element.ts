import { TemplateAttribute } from '../../html-template/types-and-interfaces/template-attribute';
import { Template } from '../../html-template/types-and-interfaces/template';
import { ModelToString } from './model-to-string';

export interface TemplateElement {
  name: string;
  attributes: TemplateAttribute[];
  content: Array<TemplateElement | ModelToString>;
  show?: Template;
}
