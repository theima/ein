import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';

export function isElementTemplate(template: ElementTemplateContent): template is ElementTemplate {
  return typeof template === 'object';
}
