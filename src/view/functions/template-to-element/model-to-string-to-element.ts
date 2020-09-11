
import { ModelToString, Value } from '../../../core';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';

export function modelToStringToElement(toString: ModelToString): DynamicElement {
  const node = document.createTextNode('');
  const update = (m: Value) => {
    node.nodeValue = toString(m);
  };

  return { element: node, contentUpdate: update };
}
