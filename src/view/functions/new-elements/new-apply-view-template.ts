import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';

export function newApplyViewTemplate(template: ElementTemplate,
                                     viewTemplate: ViewTemplate): ElementTemplate {
  return { ...template, content: viewTemplate.content};
}
