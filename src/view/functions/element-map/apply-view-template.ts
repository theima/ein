import { Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../../node-async';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';
import { containsProperty } from '../contains-property';
import { fillSlots } from '../fill-slots';

export function applyViewTemplate(usedViews: string[],
                                  getId: () => string,
                                  getViewTemplate: (name: string) => ViewTemplate | null,
                                  node: NodeAsync<Value>,
                                  template: FilledElementTemplate,
                                  viewTemplate: ViewTemplate,
                                  tempId: string): FilledElementTemplate {
  let insertedContent: Array<FilledElementTemplate | ModelToString | FilledSlot> = template.content;
  viewTemplate = fillSlots(tempId, usedViews, getId, getViewTemplate, node, viewTemplate, insertedContent);
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
