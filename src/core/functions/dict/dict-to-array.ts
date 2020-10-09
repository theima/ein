import { Dict } from '../../types-and-interfaces/dict';

export function dictToArray<T>(dict: Dict<T>): T[] {
  return Object.entries(dict).map(([key, value]) => value);
}
