import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { Property } from '../property';
import { Slot } from '../slots/slot';
import { ElementTemplate } from '../templates/element-template';

export interface ViewTemplate {
  name: string;
  children: Array<ElementTemplate | ModelToString | Slot>;
  properties: Property[];
}
