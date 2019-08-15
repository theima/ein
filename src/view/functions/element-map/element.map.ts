import { NodeAsync } from '../../../node-async/index';
import { ElementTemplateDescriptor } from '../../index';
import { partial } from '../../../core/index';
import { elementContentMap } from './element-content.map';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { applyModifiers } from '../apply-modifiers';
import { containsProperty } from '../contains-property';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { fillSlots } from '../fill-slots';

export function elementMap(usedViews: string[],
                           getId: () => number,
                           getDescriptor: (name: string) => ElementTemplateDescriptor | null,
                           insertedContentOwnerId: string,
                           node: NodeAsync<object>,
                           template: FilledElementTemplate): ModelToElementOrNull | ModelToElements {
  const descriptor: ElementTemplateDescriptor | null = getDescriptor(template.name);
  const updateUsedViews = (usedViews: string[], descriptor: ElementTemplateDescriptor | null) => {
    if (usedViews.length > 1000) {
      //simple test
      //throwing for now.
      throw new Error('Too many nested views');
    }
    return descriptor ? [...usedViews, descriptor.name] : usedViews;
  };
  usedViews = updateUsedViews(usedViews, descriptor);
  const contentMap =
    partial(
      elementContentMap,
      partial(elementMap, usedViews, getId, getDescriptor, insertedContentOwnerId, node)
    );
  if (descriptor) {
    const defaultProperties = descriptor.properties;
    const properties = template.properties;
    defaultProperties.forEach(a => {
      const propertyDefined = containsProperty(a.name, properties);
      if (!propertyDefined) {
        properties.push(a);
      }
    });
    let insertedContent: Array<FilledElementTemplate | ModelToString | FilledSlot> = template.content;
    let content: Array<FilledElementTemplate | ModelToString | FilledSlot> = fillSlots(insertedContentOwnerId, descriptor.children, insertedContent);
    template = { ...template, properties, content };
  }
  return applyModifiers(
    getId,
    contentMap,
    node,
    template
  );

}
