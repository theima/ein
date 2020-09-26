import { Dict } from '../../types-and-interfaces/dict';

export function dictsIdentical<T>(a: Dict<T>, b:Dict<T>): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length === bKeys.length) {
    return aKeys.every((k) => {
      return a[k] === b[k];
    });
  }
  return false;
}
