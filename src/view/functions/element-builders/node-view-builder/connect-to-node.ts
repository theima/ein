import { Unsubscribable } from 'rxjs';
import { Node, Value } from '../../../../core';
import { DynamicContent } from '../../../types-and-interfaces/to-rendered-content/dynamic-content';

export function connectToNode(
  node: Node<Value>,
  element: DynamicContent
): Unsubscribable | undefined {
  const update = element.contentUpdate;
  if (update) {
    return node.subscribe((m) => {
      update(m);
    });
  }
}
