import { Dict } from '../types-and-interfaces/dict';

export function removeKeysFromDict<T>(dict: Dict<T>, ...keys: string[]): Dict<T> {
  let newDict: Dict<T> = {};
  for (let key in dict) {
    if (keys.indexOf(key) === -1) {
      newDict[key] = dict[key];
    }
  }
  return newDict;
}
