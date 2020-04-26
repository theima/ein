import { Action } from '../types-and-interfaces/action';
import { ActionMap } from '../types-and-interfaces/action-map';

export function mapAction<T>(maps: ActionMap<T>, model: T, action: Action): T {
  let map: (model: T, action: Action) => T = maps;
  return map(model, action);
}
