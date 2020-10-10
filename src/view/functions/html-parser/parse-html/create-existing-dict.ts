import { Dict } from '../../../../core';

export function createExistingDict(items: string[]): Dict<true> {
  return items.reduce((d, item) => {
    d[item] = true;
    return d;
  }, {});
}
