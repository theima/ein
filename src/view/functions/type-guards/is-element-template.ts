
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/templates/element-template-content';

export function isElementTemplate(template: ElementTemplateContent): template is ElementTemplate {
  return typeof template === 'object';
}
