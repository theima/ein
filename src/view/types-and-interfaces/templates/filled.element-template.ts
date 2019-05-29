import { ElementTemplate } from './element-template';
import { ModelToString } from '../model-to-string';
import { FilledSlot } from '../slots/filled.slot';

export interface FilledElementTemplate extends ElementTemplate {
  content: Array<FilledElementTemplate | ModelToString | FilledSlot>;
}
