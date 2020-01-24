import { Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../../node-async';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';
import { containsProperty } from '../contains-property';
import { fillSlots } from '../fill-slots';

export function applyViewTemplate(node: NodeAsync<Value>,
                                  template: ElementTemplate,
                                  viewTemplate: ViewTemplate,
                                  elementMap: (e: ElementTemplate) => ModelToElementOrNull | ModelToElements): ElementTemplate {
  let insertedContent: Array<ElementTemplate | ModelToString> = template.content;
  viewTemplate = fillSlots(elementMap, node, viewTemplate, insertedContent);
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
