import { Value } from '../../../core';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicElement } from '../../types-and-interfaces/to-rendered-content/dynamic-element';

export function createModelUpdateIfNeeded(element: DynamicElement): ModelUpdate | undefined {
  if (element.contentUpdate || element.propertyUpdate) {
    return (m: Value) => {
      element.contentUpdate?.(m);
      element.propertyUpdate?.(m);
    };
  }
}
