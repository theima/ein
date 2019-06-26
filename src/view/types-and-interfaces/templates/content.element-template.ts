import { Property } from '../property';
import { DynamicProperty } from '../dynamic-property';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { ModelToElements } from '../elements/model-to-elements';
import { MappedSlot } from '../slots/mapped.slot';
import { ModelToElementOrNull } from '../elements/model-to-element-or-null';

export interface ContentElementTemplate {
  name: string;
  id: string;
  properties: Array<Property | DynamicProperty>;
  content: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>;
}
