import { KeyString } from '../../core';

export function keyStringToModelSelectors(keyString: KeyString): string[] {
  return keyString.split('.').reduce(
    (all: string[], m, index) => {
      if (index > 0 || m !== 'model') {
        all.push(m);
      }
      return all;
    }
    , []);
}
