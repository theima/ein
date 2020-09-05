import { ModelToString } from '../../../core';
import { ElementTemplateContent } from '../../types-and-interfaces/templates/element-template-content';

export function isModelToString(template: ElementTemplateContent): template is ModelToString {
  return typeof template === 'function';
}
