import { TemplateElement } from '../templates/template-element';
import { ModelToString } from '../model-to-string';
import { Slot } from '../slots/slot';

export interface ElementData {
  name: string;
  content: Array<TemplateElement | ModelToString | Slot>;
}
