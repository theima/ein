import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';
import { fillSlots } from '../fill-slots';

export function applyViewTemplate(template: FilledElementTemplate, viewTemplate: ViewTemplate, tempId: string): FilledElementTemplate {
  const defaultProperties = viewTemplate.properties;
  const properties = template.properties;
  defaultProperties.forEach((a) => {
    const propertyDefined = containsProperty(a.name, properties);
    if (!propertyDefined) {
      properties.push(a);
    }
  });
  let insertedContent: Array<FilledElementTemplate | ModelToString | FilledSlot> = template.content;
  let content: Array<FilledElementTemplate | ModelToString | FilledSlot> = fillSlots(tempId, viewTemplate.children, insertedContent);
  return { ...template, properties, content };
}
