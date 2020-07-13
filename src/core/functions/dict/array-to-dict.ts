
import { Dict } from '../../types-and-interfaces/dict';

export function arrayToDict<T>(key: string, array: T[]): Dict<T> {
  const elements: T[] = array as T[];
  return elements.reduce((dict: Dict<T>, value: T) => {
    dict[value[key]] = value;
    return dict;
  }, {});
}
