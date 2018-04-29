import { Dict } from '../types-and-interfaces/dict';

export function inDict<T>(dict: Dict<T>): (k: string) => boolean {
  return (key: string) => {
    if (!key) {
      return false;
    }
    return !!dict[key];
  };
}
