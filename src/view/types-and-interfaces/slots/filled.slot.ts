import { Slot } from './slot';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { FilledElementTemplate } from '../templates/filled.element-template';

export interface FilledSlot extends Slot {
  filledSlot: true;
  filledFor?: string;
  content?: Array<FilledElementTemplate | ModelToString | FilledSlot>;
}
