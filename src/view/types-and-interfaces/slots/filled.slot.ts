import { Slot } from './slot';
import { ModelToString } from '../model-to-string';
import { TemplateElement } from '../..';

export interface FilledSlot extends Slot {
  content?: Array<TemplateElement | ModelToString | FilledSlot>;
}
