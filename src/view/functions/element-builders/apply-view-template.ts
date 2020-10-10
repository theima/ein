import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ViewTemplate } from '../../types-and-interfaces/view-template/view-template';

export function applyViewTemplate(
  template: ElementTemplate,
  viewTemplate: ViewTemplate
): ElementTemplate {
  return { ...template, content: viewTemplate.content };
}
