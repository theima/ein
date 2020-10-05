import { Value } from '../../../../core';
import { ModelUpdate } from '../../../types-and-interfaces/model-update';
import { DynamicElement } from '../../../types-and-interfaces/to-rendered-content/dynamic-element';

export function addContentUpdate(modelMap: (m:Value) => Value, element: DynamicElement, slotContentUpdate?: ModelUpdate): DynamicElement {
  const elementContentUpdate = element.contentUpdate;
  const contentUpdate: ModelUpdate = (m: Value) => {
    slotContentUpdate?.(m);
    m = modelMap(m);
    elementContentUpdate?.(m);
  };
  return { ...element, contentUpdate };
}
