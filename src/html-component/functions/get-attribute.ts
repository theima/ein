import { KeyString, get } from '../../core';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { keyStringToSelectors } from '../../html-template/functions/key-string-to-selectors';

export function getAttribute<T, U>(model: T, keystring: KeyString): U | null {
  let props = keyStringToSelectors(keystring, BuiltIn.Attributes);
  return get(model, ...props);
}
