import { NodeAsync } from '../../../node-async/index';
import {
  ModelToElement,
  ElementData,
  ModelMap
} from '../../index';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { partial } from '../../../core/index';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { TemplateElement } from '../../types-and-interfaces/templates/template-element';
import { isLiveElement } from '../type-guards/is-live-element';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { getNodeForTemplateElement } from './get-node-for-template-element';
import { childElementMap } from './child-element.map';
import { templateElementToModelToElement } from './template-element-to-model-to-element';

export function elementMap(usedViews: string[],
                           getId: () => number,
                           getElement: (name: string) => ElementData | null,
                           insertedContentOwnerId: string,
                           elementData: ElementData | null,
                           node: NodeAsync<object>,
                           templateElement: TemplateElement,
                           modelMap: ModelMap = m => m): ModelToElement {
  const viewId: string = getId() + '';
  const updateUsedViews = (usedViews: string [], elementData: ElementData | null) => {
    if (usedViews.length > 1000) {
      //simple test
      //throwing for now.
      throw new Error('Too many nested views');
    }
    return elementData ? [...usedViews, elementData.name] : usedViews;
  };
  usedViews = updateUsedViews(usedViews, elementData);

  const contentMap: (e: TemplateElement | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot =
    partial(
      childElementMap,
      partial(elementMap, usedViews, getId, getElement, insertedContentOwnerId),
      partial(getNodeForTemplateElement, node),
      getElement
    );
  const modelToElement = templateElementToModelToElement(templateElement, node, viewId, insertedContentOwnerId, contentMap, elementData, modelMap);
  return (m: object, im: object) => {
    const result = modelToElement(m, im);
    if (isLiveElement(result)) {
      result.sendChildUpdate();
    }
    return result;
  };
}
