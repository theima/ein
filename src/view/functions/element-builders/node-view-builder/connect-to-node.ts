import { Node, Value } from '../../../../core';
import { DynamicElement } from '../../../types-and-interfaces/to-element/dynamic-element';

export function connectToNode(node: Node<Value>, element: DynamicElement): void {
  const update = element.contentUpdate;
  if (update) {
    node.subscribe((m) => {
      update(m);
    });
  }
}
