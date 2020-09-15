
import { ModelToString, Value } from '../../../core';
import { DynamicContent } from '../../types-and-interfaces/to-rendered-content/dynamic-content';

export function modelToStringToRenderedContent(toString: ModelToString): DynamicContent {
  const node = document.createTextNode('');
  const update = (m: Value) => {
    node.nodeValue = toString(m);
  };

  return { element: node, contentUpdate: update };
}
