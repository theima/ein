import { KeyString } from '../../core/index';
import { BuiltIn } from '../types-and-interfaces/built-in';

export function keyStringToModelSelectors(keyString: KeyString): string[] {
  return keyString.split(BuiltIn.ModelSeparator).reduce(
    (all: string[], m, index) => {
      if (index > 0 || m !== BuiltIn.Model) {
        all.push(m);
      }
      return all;
    }
    , []);
}
