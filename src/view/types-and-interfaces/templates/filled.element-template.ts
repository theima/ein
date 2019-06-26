import { ElementTemplate } from './element-template';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { FilledSlot } from '../slots/filled.slot';

export interface FilledElementTemplate extends ElementTemplate {
  content: Array<FilledElementTemplate | ModelToString | FilledSlot>;
}
