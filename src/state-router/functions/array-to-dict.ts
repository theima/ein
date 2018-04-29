import { Dict } from '../types-and-interfaces/dict';

export function arrayToDict<T extends { name: string }>(array: T[]): Dict<T> {
  return array.reduce((dict: Dict<T>, state: T) => {
    dict[state.name] = state;
    return dict;
  }, {});
}
