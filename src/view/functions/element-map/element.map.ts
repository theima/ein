import { NodeAsync } from '../../../node-async/index';
import { ElementData } from '../../index';
import { partial } from '../../../core/index';
import { TemplateElement } from '../../types-and-interfaces/templates/template-element';
import { elementContentMap } from './element-content.map';
import { isComponentElementData } from '../type-guards/is-component-element-data';
import { componentToModelToElement } from './component-to-model-to-element';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { applyModifiers } from '../apply-modifiers';
import { containsAttribute } from '../contains-attribute';

export function elementMap(usedViews: string[],
                           getId: () => number,
                           getElementData: (name: string) => ElementData | null,
                           insertedContentOwnerId: string,
                           node: NodeAsync<object>,
                           templateElement: TemplateElement): ModelToElementOrNull | ModelToElements {
  const viewId: string = getId() + '';
  const elementData: ElementData | null = getElementData(templateElement.name);
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
    const defaultAttributes = elementData.attributes;
    const attributes = templateElement.attributes;
    defaultAttributes.forEach(a => {
      const attributeDefined = containsAttribute(a.name, attributes);
      if (!attributeDefined) {
        attributes.push(a);
      }
    });
    templateElement = { ...templateElement, attributes };
  }
  if (isComponentElementData(elementData)) {
    return componentToModelToElement(templateElement, node, viewId, insertedContentOwnerId, contentMap, elementData);
  }
  return applyModifiers(
    getId,
    insertedContentOwnerId,
    elementData,
    contentMap,
    node,
    templateElement
    );

}
