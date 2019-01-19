import { Attribute } from '../attribute';
import { DynamicAttribute } from '../dynamic-attribute';
import { ModelToString } from '../model-to-string';
import { ModelToElements } from '../elements/model-to-elements';
import { MappedSlot } from '../slots/mapped.slot';
import { ModelToElementOrNull } from '../elements/model-to-element-or-null';

export interface ContentTemplateElement {
  name: string;
  id: string;
  insertedContentOwnerId: string;
  attributes: Array<Attribute | DynamicAttribute>;
  content: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>;
}
