import { Dict } from '../../core';

export function inDict<T>(dict: Dict<T>): (k: string) => boolean {
  return (key: string) => {
    if (!key) {
      return false;
    }
    return !!dict[key];
  };
}
