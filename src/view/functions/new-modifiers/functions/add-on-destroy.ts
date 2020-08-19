import { DynamicNode } from '../../../types-and-interfaces/new-elements/dynamic-node';

export function addOnDestroy(dynamicNode:DynamicNode, onDestroy: () => void): DynamicNode {
  const existing = dynamicNode.onDestroy;
  return {...dynamicNode, onDestroy: () => {
    onDestroy();
    existing?.();
  }};
}
