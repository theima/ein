import { Node, Value } from '../../../../core';
import { DynamicNode } from '../../../types-and-interfaces/new-elements/dynamic-node';

export function connectToNode(node: Node<Value>, dynamicNode: DynamicNode): void {
  const update = dynamicNode.contentUpdate;
  if (update) {
    node.subscribe((m) => {
      update(m);
    });
  }
}
