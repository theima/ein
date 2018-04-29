import { Dict } from '../types-and-interfaces/dict';

export function dictToArray<T>(dict: Dict<T>): T[] {
  let result: T[] = [];
  for (let key in dict) {
    result.push(dict[key]);
  }
  return result;
}
