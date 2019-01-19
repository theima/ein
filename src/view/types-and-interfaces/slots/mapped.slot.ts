import { Slot } from './slot';
import { ModelToElementOrNull } from '../elements/model-to-element-or-null';
import { ModelToString } from '../model-to-string';
import { ModelToElements } from '../elements/model-to-elements';

export interface MappedSlot extends Slot {
  mappedSlot: true;
  mappedFor?: string;
  content?: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>;
}
