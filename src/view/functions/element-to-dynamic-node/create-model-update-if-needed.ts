import { Value } from '../../../core';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';

export function createModelUpdateIfNeeded(node: DynamicNode): ModelUpdate | undefined {
  if (node.contentUpdate || node.propertyUpdate) {
    return (m: Value) => {
      node.contentUpdate?.(m);
      node.propertyUpdate?.(m);
    };
  }
}
