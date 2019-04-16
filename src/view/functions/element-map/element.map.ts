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

export function elementMap(usedViews: string[],
                           getId: () => number,
                           getElement: (name: string) => ElementData | null,
                           insertedContentOwnerId: string,
                           elementData: ElementData | null,
                           node: NodeAsync<object>,
                           templateElement: TemplateElement): ModelToElement {
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
  const applymodifiermap = partial(elementMap, usedViews, getId, getElement, insertedContentOwnerId);
  const contentMap: (e: TemplateElement | ModelToString | FilledSlot) => ModelToElement| ModelToString | MappedSlot =
    partial(
      childElementMap,
      applymodifiermap,
      getElement,
      node
    );
  let modelToElement: ModelToElement;
  // tslint:disable-next-line: prefer-conditional-expression
  if (isComponentElementData(elementData)) {
    modelToElement = componentToModelToElement(templateElement, node, viewId, insertedContentOwnerId, contentMap, elementData);
  } else {
    modelToElement = templateElementToModelToElement(templateElement, node, viewId, insertedContentOwnerId, contentMap, applymodifiermap,getElement, elementData);
  }

  return (m: object, im: object) => {
    const result = modelToElement(m, im);
    if (isLiveElement(result)) {
      result.sendChildUpdate();
    }
    return result;
  };
}
