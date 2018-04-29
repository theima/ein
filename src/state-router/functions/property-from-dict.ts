import { Dict } from '../types-and-interfaces/dict';
import { fromDict } from './from-dict';

export function propertyFromDict<T, k extends keyof T>(dict: Dict<T>, property: k, defaultValue: T[k]): (name: string) => T[k] {
  const get: (name: string) => T | null = fromDict(dict);
  return (name: string) => {
    const item: T | null = get(name);
    if (item) {
      const val: T[k] = item[property];
      if (val) {
        return val;
      }
    }
    return defaultValue;
  };
}
