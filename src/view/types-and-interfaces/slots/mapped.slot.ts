import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { ModelToElementOrNull } from '../elements/model-to-element-or-null';
import { ModelToElements } from '../elements/model-to-elements';
import { Slot } from './slot';

export interface MappedSlot extends Slot {
  mappedSlot: true;
  mappedFor?: string;
  content?: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>;
}
