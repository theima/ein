import { partial, Value } from '../../../core/index';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../../node-async/index';
import { ElementTemplateDescriptor } from '../../index';
import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { applyModifiers } from '../apply-modifiers';
import { containsProperty } from '../contains-property';
import { fillSlots } from '../fill-slots';
import { elementsIdentical } from './compare/elements-identical';
import { elementContentMap } from './element-content.map';

export function elementMap(usedViews: string[],
                           getId: () => string,
                           getDescriptor: (name: string) => ElementTemplateDescriptor | null,
                           insertedContentOwnerId: string,
                           node: NodeAsync<Value>,
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
  const modifiedToElement: ModelToElementOrNull | ModelToElements = applyModifiers(
    getId,
    contentMap,
    node,
    template
  );
  let last: Element;
  const modelToElement: ModelToElementOrNull | ModelToElements = (m: Value, im: Value) => {
    let result = modifiedToElement(m, im) as any;
    last = elementsIdentical(last, result) ? last : result;
    return last;
  };
  return modelToElement;
}
