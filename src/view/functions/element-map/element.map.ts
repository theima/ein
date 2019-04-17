import { NodeAsync } from '../../../node-async/index';
import { ModelToElement, ElementData } from '../../index';
import { partial } from '../../../core/index';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { TemplateElement } from '../../types-and-interfaces/templates/template-element';
import { isLiveElement } from '../type-guards/is-live-element';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { childElementMap } from './child-element.map';
import { templateElementToModelToElement } from './template-element-to-model-to-element';
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
                           elementData: ElementData | null,
                           node: NodeAsync<object>,
                           templateElement: TemplateElement): ModelToElementOrNull | ModelToElements {
  const viewId: string = getId() + '';
  const updateUsedViews = (usedViews: string[], elementData: ElementData | null) => {
    if (usedViews.length > 1000) {
      //simple test
      //throwing for now.
      throw new Error('Too many nested views');
    }
    return elementData ? [...usedViews, elementData.name] : usedViews;
  };
  usedViews = updateUsedViews(usedViews, elementData);
  const applymodifiermap = partial(elementMap, usedViews, getId, getElementData, insertedContentOwnerId);
  const contentMap: (e: TemplateElement | ModelToString | FilledSlot) => ModelToElement | ModelToString | MappedSlot =
    partial(
      childElementMap,
      applymodifiermap as any,
      getElementData,
      node
    );
  let modelToElement: ModelToElements | ModelToElementOrNull;
  // tslint:disable-next-line: prefer-conditional-expression
  if (isComponentElementData(elementData)) {
    modelToElement = componentToModelToElement(templateElement, node, viewId, insertedContentOwnerId, contentMap, elementData);
  } else {
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
    const apply: (e: TemplateElement) => ModelToElementOrNull | ModelToElements = (childElement: TemplateElement) => {
      const elementData: ElementData | null = getElementData(childElement.name);
      const forapplymodifiers: (node: NodeAsync<object>,
                                templateElement: TemplateElement) => ModelToElement =
        (n: NodeAsync<object>, t: TemplateElement) => {
          return templateElementToModelToElement(t, n, getId() + '', insertedContentOwnerId, getElementData, elementData, getId, applymodifiermap);
        };
      return applyModifiers(node, forapplymodifiers, childElement);
    };
    modelToElement = apply(templateElement);
  }
  const modelToElementLive = (m: object, im: object) => {
    const result = modelToElement(m, im);
    if (isLiveElement(result)) {
      result.sendChildUpdate();
    }
    return result;
  };
  return modelToElementLive as any;
}
