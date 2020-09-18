import { get, KeyString, Value } from '../../core';
import { ParseString } from '../types-and-interfaces/html-parser/parse-string';
import { keyStringToSelectors } from './key-string-to-selectors';

export function getModel(model: Value, keystring: KeyString): Value | undefined {
  let props = keyStringToSelectors(keystring, ParseString.Model);
  return get(model, ...props);
}
