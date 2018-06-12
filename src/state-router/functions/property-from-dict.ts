import { fromDict } from './from-dict';
import { Dict } from '../../core';
import { partial } from '../../core/functions/partial';

export function propertyFromDict<T, k extends keyof T>(dict: Dict<T>, property: k, defaultValue: T[k], name: string): T[k] {
  const get: (name: string) => T | null = partial(fromDict as any, dict);
  const item: T | null = get(name);
  if (item) {
    const val: T[k] = item[property];
    if (val) {
      return val;
    }
  }
  return defaultValue;
}
