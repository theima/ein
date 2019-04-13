import { TemplateElement } from '../templates/template-element';
import { ModelToString } from '../model-to-string';
import { Slot } from '../slots/slot';
import { Attribute } from '../attribute';

export interface ElementData {
  name: string;
  children: Array<TemplateElement | ModelToString | Slot>;
  attributes: Attribute[];
}
