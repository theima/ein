import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { Slot } from '../../types-and-interfaces/slots/slot';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { isSlot } from './is-slot';

export function isElementTemplate(template: ElementTemplate | ModelToString | Slot): template is ElementTemplate {
  return typeof template === 'object' && !isSlot(template);
}
