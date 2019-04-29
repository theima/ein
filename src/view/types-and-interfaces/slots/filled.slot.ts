import { Slot } from './slot';
import { ModelToString } from '../model-to-string';
import { FilledTemplateElement } from '../templates/filled.template-element';

export interface FilledSlot extends Slot {
  filledSlot: true;
  filledFor?: string;
  content?: Array<FilledTemplateElement | ModelToString | FilledSlot>;
}
