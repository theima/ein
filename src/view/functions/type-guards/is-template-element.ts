import { TemplateElement } from '../../types-and-interfaces/templates/template-element';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { Slot } from '../../types-and-interfaces/slots/slot';
import { isSlot } from './is-slot';

export function isTemplateElement(template: TemplateElement | ModelToString | Slot): template is TemplateElement {
  return typeof template === 'object' && !isSlot(template);
}
