import { ModelToString } from '../../../core';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';

export function isModelToString(template: ElementTemplate | ModelToString | string): template is ModelToString {
  return typeof template === 'function';
}
