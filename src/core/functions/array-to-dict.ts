import { Dict } from '../types-and-interfaces/dict';
import { isArray } from 'rxjs/internal-compatibility';

export function arrayToDict<T, U>(key: string, array: T[]): Dict<T>;
export function arrayToDict<T, U>(elementMap: (e: T) => U, key: string, array: T[]): Dict<U>;
export function arrayToDict<T, U>(elementMaporKey: string | ((e: T) => U), keyOrArray: string | T[], array?: T[]): Dict<U> {
  const elements: T[] = isArray(keyOrArray) ? keyOrArray : array as T[];
  const map: (e: T) => U = typeof elementMaporKey === 'function' ? elementMaporKey : e => e as any;
  const key: string = typeof elementMaporKey === 'string' ? elementMaporKey : keyOrArray as string;
  return elements.reduce((dict: Dict<U>, value: T) => {
    dict[value[key]] = map(value);
    return dict;
  }, {});
}
