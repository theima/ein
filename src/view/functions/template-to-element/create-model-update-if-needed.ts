import { Value } from '../../../core';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';

export function createModelUpdateIfNeeded(node: DynamicElement): ModelUpdate | undefined {
  if (node.contentUpdate || node.propertyUpdate) {
    return (m: Value) => {
      node.contentUpdate?.(m);
      node.propertyUpdate?.(m);
    };
  }
}
