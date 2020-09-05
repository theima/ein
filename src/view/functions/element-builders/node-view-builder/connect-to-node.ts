import { Value } from '../../../../core';
import { NodeAsync } from '../../../../node-async';
import { DynamicNode } from '../../../types-and-interfaces/new-elements/dynamic-node';

export function connectToNode(node: NodeAsync<Value>, dynamicNode: DynamicNode): void {
  const update = dynamicNode.contentUpdate;
  if (update) {
    node.subscribe((m) => {
      update(m);
    });
  }
}
