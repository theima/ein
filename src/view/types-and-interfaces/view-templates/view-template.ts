import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { Property } from '../property';
import { ElementTemplate } from '../templates/element-template';

export interface ViewTemplate {
  name: string;
  children: Array<ElementTemplate | ModelToString>;
  properties: Property[];
}
