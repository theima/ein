import { TemplateElement } from '../templates/template-element';
import { ModelToString } from '../model-to-string';
import { Slot } from '../slots/slot';
import { Property } from '../property';

export interface ElementData {
  name: string;
  children: Array<TemplateElement | ModelToString | Slot>;
  attributes: Property[];
}
