import { ModelToString, Value } from '../../../core';
import { whenChanged } from '../../../core/functions/when-changed';
import { DynamicContent } from '../../types-and-interfaces/to-rendered-content/dynamic-content';

export function modelToStringToRenderedContent(
  toString: ModelToString
): DynamicContent {
  const node = document.createTextNode('');
  const setValue = whenChanged((m: string) => {
    node.nodeValue = m;
  });
  const update = (m: Value) => {
    setValue(toString(m));
  };

  return { element: node, contentUpdate: update };
}
