
import { joinFunctionsIfNeeded } from '../../../core';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicContent } from '../../types-and-interfaces/to-rendered-content/dynamic-content';
import { ElementDestroy } from '../../types-and-interfaces/to-rendered-content/element-destroy';
import { isDynamicElement } from '../type-guards/is-dynamic-element';

export function setContent(content: DynamicContent[], elementAdder: (element: ChildNode) => void): [ModelUpdate | undefined, ElementDestroy | undefined] {
  let updates: ModelUpdate[] = [];
  let destroys: ElementDestroy[] = [];
  content.forEach((c) => {
    elementAdder(c.element);
    if (c.contentUpdate) {
      updates.push(c.contentUpdate);
    }
    if (isDynamicElement(c)) {
      c.afterAdd?.(c.element as HTMLElement);
      if (c.onDestroy) {
        destroys.push(c.onDestroy);
      }
      if (c.propertyUpdate) {
        updates.push(c.propertyUpdate);
      }
    }

  });

  return [joinFunctionsIfNeeded(updates), joinFunctionsIfNeeded(destroys)];

}
