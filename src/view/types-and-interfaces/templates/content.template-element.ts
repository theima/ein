import { Property } from '../property';
import { DynamicProperty } from '../dynamic-property';
import { ModelToString } from '../model-to-string';
import { ModelToElements } from '../elements/model-to-elements';
import { MappedSlot } from '../slots/mapped.slot';
import { ModelToElementOrNull } from '../elements/model-to-element-or-null';

export interface ContentTemplateElement {
  name: string;
  id: string;
  attributes: Array<Property | DynamicProperty>;
  content: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>;
}
