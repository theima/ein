import { KeyString } from '../../core';
import { ParseString } from '../types-and-interfaces/html-parser/parse-string';

export function keyStringToSelectors(keyString: KeyString, root: string): [string, ...string[]] {
  return keyString.split(ParseString.KeyStringSeparator).reduce(
    (all: string[], m, index) => {
      if (index > 0 || m !== root) {
        all.push(m);
      }
      return all;
    }
    , []) as [string, ...string[]];
}
