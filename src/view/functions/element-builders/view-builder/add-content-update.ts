import { Value } from '../../../../core';
import { ModelUpdate } from '../../../types-and-interfaces/model-update';
import { DynamicElement } from '../../../types-and-interfaces/to-rendered-content/dynamic-element';

export function addContentUpdate(modelMap: (m:Value) => Value, element: DynamicElement, slotContentUpdate?: ModelUpdate): DynamicElement {
  const elementContentUpdate = element.contentUpdate;
  const viewUpdate: ModelUpdate = (m: Value) => {
    elementContentUpdate?.(m);
    slotContentUpdate?.(m);
  };
  const contentUpdate: ModelUpdate = (m: Value) => {
    m = modelMap(m);
    viewUpdate(m);
  };
  return { ...element, contentUpdate };
}
