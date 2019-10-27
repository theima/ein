import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { FilledElementTemplate } from '../templates/filled.element-template';
import { Slot } from './slot';

export interface FilledSlot extends Slot {
  filledSlot: true;
  filledFor?: string;
  content?: Array<FilledElementTemplate | ModelToString | FilledSlot>;
}
