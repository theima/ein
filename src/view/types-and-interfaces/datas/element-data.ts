import { ElementTemplate } from '../templates/element-template';
import { ModelToString } from '../model-to-string';
import { Slot } from '../slots/slot';
import { Property } from '../property';

export interface ElementData {
  name: string;
  children: Array<ElementTemplate | ModelToString | Slot>;
  properties: Property[];
}
