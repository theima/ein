import { Action } from '../types-and-interfaces/action';
import { ActionMaps } from '../types-and-interfaces/action-maps';

export function mapAction<T>(maps: ActionMaps<T>, model: T | null, action: Action): T {
  let map: (model: T | null, action: Action) => T = maps.actionMap;
  if (model === undefined) {
    model = null;
  }
  return map(model, action);
}
