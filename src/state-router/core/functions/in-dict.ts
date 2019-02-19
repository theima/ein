import { Dict } from '../../../core';

export function inDict<T>(dict: Dict<T>, key: string): boolean {
  if (!key) {
    return false;
  }
  return !!dict[key];
}
