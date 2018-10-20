import { KeyString, get } from '../../core';
import { keyStringToSelectors } from './key-string-to-selectors';
import { BuiltIn } from '../types-and-interfaces/built-in';

export function getModel<T, U>(model: T, keystring: KeyString): U | null {
  let props = keyStringToSelectors(keystring, BuiltIn.Model);
  return get(model, ...props);
}
