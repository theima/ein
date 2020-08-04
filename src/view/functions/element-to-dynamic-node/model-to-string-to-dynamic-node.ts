
import { ModelToString, Value } from '../../../core';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';

export function modelToStringToDynamicNode(toString: ModelToString): DynamicNode {
  const node = document.createTextNode('');
  const update = (m: Value) => {
    node.nodeValue = toString(m);
  };

  return { node, update };
}
