import { NodeAsync } from '../../../node-async/index';
import { ElementData } from '../../index';
import { partial } from '../../../core/index';
import { elementContentMap } from './element-content.map';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { applyModifiers } from '../apply-modifiers';
import { containsProperty } from '../contains-property';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { fillSlots } from '../fill-slots';

export function elementMap(usedViews: string[],
                           getId: () => number,
                           getElementData: (name: string) => ElementData | null,
                           insertedContentOwnerId: string,
                           node: NodeAsync<object>,
                           template: FilledElementTemplate): ModelToElementOrNull | ModelToElements {
  const elementData: ElementData | null = getElementData(template.name);
  const updateUsedViews = (usedViews: string[], elementData: ElementData | null) => {
    if (usedViews.length > 1000) {
      //simple test
      //throwing for now.
      throw new Error('Too many nested views');
    }
    return elementData ? [...usedViews, elementData.name] : usedViews;
  };
  usedViews = updateUsedViews(usedViews, elementData);
  const contentMap =
    partial(
      elementContentMap,
      partial(elementMap, usedViews, getId, getElementData, insertedContentOwnerId, node),
      getElementData
    );
  if (elementData) {
    const defaultProperties = elementData.properties;
    const properties = template.properties;
    defaultProperties.forEach(a => {
      const propertyDefined = containsProperty(a.name, properties);
      if (!propertyDefined) {
        properties.push(a);
      }
    });
    let insertedContent: Array<FilledElementTemplate | ModelToString | FilledSlot> = template.content;
    let content: Array<FilledElementTemplate | ModelToString | FilledSlot> = fillSlots(insertedContentOwnerId, elementData.children, insertedContent);
    template = { ...template, properties, content };
  }
  return applyModifiers(
    getId,
    contentMap,
    node,
    template
  );

}
