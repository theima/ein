import { TemplateHtmlElementData } from '../types-and-interfaces/template.html-element-data';

export function viewTemplate(name: string,
                             template: string): TemplateHtmlElementData {
  return {name, content: template};
}
