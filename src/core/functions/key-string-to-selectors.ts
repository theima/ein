import { KeyString } from '..';
import { BuiltIn } from '../types-and-interfaces/built-in';

export function keyStringToSelectors(keyString: KeyString, root: string): string[] {
  return keyString.split(BuiltIn.KeyStringSeparator).reduce(
    (all: string[], m, index) => {
      if (index > 0 || m !== root) {
        all.push(m);
      }
      return all;
    }
    , []);
}