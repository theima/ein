import { TemplateElement } from './template-element';
import { ModelToString } from '../model-to-string';
import { FilledSlot } from '../slots/filled.slot';

export interface FilledTemplateElement extends TemplateElement {
  content: Array<FilledTemplateElement | ModelToString | FilledSlot>;
}
