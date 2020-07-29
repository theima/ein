import { Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../../node-async';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';
import { containsProperty } from '../contains-property';
import { fillSlots } from '../fill-slots';

export function applyViewTemplate(node: NodeAsync<Value>,
                                  template: ElementTemplate,
                                  viewTemplate: ViewTemplate): ElementTemplate {
  let insertedContent: Array<ElementTemplate | ModelToString | string> = template.content;
  viewTemplate = fillSlots(node, viewTemplate, insertedContent);
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
