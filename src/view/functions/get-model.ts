import { KeyString, get } from '../../core';
import { keyStringToSelectors } from '../../core/functions/key-string-to-selectors';
import { BuiltIn } from '../../html-parser/types-and-interfaces/built-in';
import { Value } from '../../core/types-and-interfaces/value/value';

export function getModel(model: Value, keystring: KeyString): Value | null {
  let props = keyStringToSelectors(keystring, BuiltIn.Model);
  return get(model, ...props);
}
