import { joinFunctionsIfNeeded } from '../../../core';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicContent } from '../../types-and-interfaces/to-rendered-content/dynamic-content';
import { ElementDestroy } from '../../types-and-interfaces/to-rendered-content/element-destroy';
import { isDynamicAnchor } from '../type-guards/is-dynamic-anchor';
import { isDynamicElement } from '../type-guards/is-dynamic-element';
import { isModifiableDynamicContent } from '../type-guards/is-modifiable-dynamic-content';

export function setContent(
  content: DynamicContent[],
  elementAdder: (element: ChildNode) => void
): [ModelUpdate | undefined, ElementDestroy | undefined] {
  const updates: ModelUpdate[] = [];
  const destroys: ElementDestroy[] = [];
  content.forEach((c) => {
    elementAdder(c.element);
    if (c.contentUpdate) {
      updates.push(c.contentUpdate);
    }
    if (isModifiableDynamicContent(c)) {
      if (c.propertyUpdate) {
        updates.push(c.propertyUpdate);
      }
      if (isDynamicElement(c)) {
        if (c.onDestroy) {
          destroys.push(c.onDestroy);
        }
      }
    }
    if (isDynamicElement(c) || isDynamicAnchor(c)) {
      c.afterAdd?.(c.element as any);
    }
  });

  return [joinFunctionsIfNeeded(updates), joinFunctionsIfNeeded(destroys)];
}
