import { ElementTemplate } from '../templates/element-template';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { Slot } from '../slots/slot';
import { Property } from '../property';

export interface ElementTemplateDescriptor {
  name: string;
  children: Array<ElementTemplate | ModelToString | Slot>;
  properties: Property[];
}
