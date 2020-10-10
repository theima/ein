import { Dict } from '../../types-and-interfaces/dict';

export function arrayToKeyValueDict<T, K extends keyof T, V extends keyof T>(
  key: K,
  valueName: V,
  array: T[]
): Dict<T[V]> {
  return array.reduce((dict: Dict<T[V]>, item) => {
    const itemKey: string = (item[key] as unknown) as string;
    dict[itemKey] = item[valueName];
    return dict;
  }, {});
}
