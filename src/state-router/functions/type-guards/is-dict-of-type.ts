import { Dict, dictToArray } from '../../../core';

export function isDictOfType<T, S extends T>(dict: Dict<T>, verify: (a: T) => a is S): dict is Dict<S> {
  const items = dictToArray(dict);
  let result: boolean = true;
  if (items.length > 0) {
    result = verify(items[0]);
  }
  return result;
}
