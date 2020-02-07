import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { DynamicProperty } from '../dynamic-property';
import { Property } from '../property';

export interface ElementTemplate {
  name: string;
  properties: Array<Property | DynamicProperty>;
  content: Array<ElementTemplate | ModelToString>;
}
