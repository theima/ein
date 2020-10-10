import { Dict } from '../..';

export function removeKeysFromDict<T>(
  dict: Dict<T>,
  ...keys: string[]
): Dict<T> {
  const newDict: Dict<T> = {};
  for (const key in dict) {
    if (keys.indexOf(key) === -1) {
      newDict[key] = dict[key];
    }
  }
  return newDict;
}
