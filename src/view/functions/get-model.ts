import { get, KeyString, Value } from '../../core';
import { keyStringToSelectors } from './key-string-to-selectors';
import { BuiltIn } from '../../html-parser/types-and-interfaces/built-in';

export function getModel(model: Value, keystring: KeyString): Value | undefined {
  let props = keyStringToSelectors(keystring, BuiltIn.Model);
  return get(model, ...props);
}
