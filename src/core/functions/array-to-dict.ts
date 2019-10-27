import { isArray } from 'rxjs/internal-compatibility';
import { Dict } from '../types-and-interfaces/dict';

export function arrayToDict<T, U>(key: string, array: T[]): Dict<T>;
export function arrayToDict<T, U>(elementMap: (e: T) => U, key: string, array: T[]): Dict<U>;
export function arrayToDict<T, U>(elementMapOrKey: string | ((e: T) => U), keyOrArray: string | T[], array?: T[]): Dict<U> {
  const elements: T[] = isArray(keyOrArray) ? keyOrArray : array as T[];
  const map: (e: T) => U = typeof elementMapOrKey === 'function' ? elementMapOrKey : e => e as any;
  const key: string = typeof elementMapOrKey === 'string' ? elementMapOrKey : keyOrArray as string;
  return elements.reduce((dict: Dict<U>, value: T) => {
    dict[value[key]] = map(value);
    return dict;
  }, {});
}
