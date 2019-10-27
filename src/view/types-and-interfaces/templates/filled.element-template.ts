import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { FilledSlot } from '../slots/filled.slot';
import { ElementTemplate } from './element-template';

export interface FilledElementTemplate extends ElementTemplate {
  content: Array<FilledElementTemplate | ModelToString | FilledSlot>;
}
