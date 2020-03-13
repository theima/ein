import { Dict } from '..';
import { fromDict } from './from-dict';

export function propertyFromDict<T, k extends keyof T>(dict: Dict<T>, property: k, defaultValue: T[k], name: string): T[k] {
  const item: T | null = fromDict(dict, name);
  if (item) {
    const val: T[k] = item[property];
    if (val !== undefined) {
      return val;
    }
  }
  return defaultValue;
}
