import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/templates/element-template-content';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';
import { containsProperty } from '../contains-property';
import { fillSlots } from '../fill-slots';

export function applyViewTemplate(node: NodeAsync<Value>,
                                  template: ElementTemplate,
                                  viewTemplate: ViewTemplate): ElementTemplate {
  let insertedContent: ElementTemplateContent[] = template.content;
  viewTemplate = fillSlots(node, viewTemplate, insertedContent);
  const defaultProperties = viewTemplate.properties;
  const properties = template.properties;
  defaultProperties.forEach((a) => {
    const propertyDefined = containsProperty(a.name, properties);
    if (!propertyDefined) {
      properties.push(a);
    }
  });
  return { ...template, properties, content: viewTemplate.content as any};
}
