import { KeyString } from '../../core/types-and-interfaces/key-string';
import { get } from '../../core/functions/get';
import { keyStringToModelSelectors } from './key-string-to-model-selectors';

export function getModel<T, U>(model: T, keystring: KeyString): U {
  let props = keyStringToModelSelectors(keystring);
  return get(model, ...props);
}
