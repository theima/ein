import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';
import { containsProperty } from '../contains-property';

export function newApplyViewTemplate(template: ElementTemplate,
                                     viewTemplate: ViewTemplate): ElementTemplate {
  const defaultProperties = viewTemplate.properties;
  const properties = template.properties;
  defaultProperties.forEach((a) => {
    const propertyDefined = containsProperty(a.name, properties);
    if (!propertyDefined) {
      properties.push(a);
    }
  });
  return { ...template, properties, content: viewTemplate.children as any};
}
