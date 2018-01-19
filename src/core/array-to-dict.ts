import { Dict } from '../types-and-interfaces/dict';

export function arrayToDict<T>(key: string, array: T[]): Dict<T> {
  return array.reduce((dict: Dict<T>, value: T) => {
    dict[value[key]] = value;
    return dict;
  }, {});
}
