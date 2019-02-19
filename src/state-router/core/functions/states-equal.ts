import { State } from '../types-and-interfaces/state';
import { paramsEqual } from './params-equal';

export function statesEqual(a: State, b: State): boolean {
  if (!a || !b) {
    return false;
  }
  if (a.name === b.name) {
    return paramsEqual(a.params, b.params);
  }
  return false;
}
