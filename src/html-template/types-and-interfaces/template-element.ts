import { TemplateString } from './template-string';
import { TemplateAttribute } from './template-attribute';
import { Template } from './template';

export interface TemplateElement {
  name: string;
  attributes: TemplateAttribute[];
  content: Array<TemplateElement | TemplateString>;
  show?: Template;
}
