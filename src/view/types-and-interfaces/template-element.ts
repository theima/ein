import { TemplateString } from '../../html-template/types-and-interfaces/template-string';
import { TemplateAttribute } from '../../html-template/types-and-interfaces/template-attribute';
import { Template } from '../../html-template/types-and-interfaces/template';

export interface TemplateElement {
  name: string;
  attributes: TemplateAttribute[];
  content: Array<TemplateElement | TemplateString>;
  show?: Template;
}
