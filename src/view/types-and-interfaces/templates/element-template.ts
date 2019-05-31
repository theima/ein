import { ModelToString } from '../model-to-string';
import { DynamicProperty } from '../dynamic-property';
import { Property } from '../property';
import { Slot } from '../slots/slot';

export interface ElementTemplate {
  name: string;
  properties: Array<Property | DynamicProperty>;
  content: Array<ElementTemplate | ModelToString | Slot>;
}
