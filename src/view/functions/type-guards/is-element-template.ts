import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';

export function isElementTemplate(template: ElementTemplate | ModelToString): template is ElementTemplate {
  return typeof template === 'object';
}
