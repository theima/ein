import { Action } from '../../types-and-interfaces/action';
import { ActionMaps } from '../../types-and-interfaces/action-maps';

export function mapAction<T>(maps: ActionMaps<T>, model: T, action: Action): T {
  let map: (model: T, action: Action) => T = maps.actionMap;
  return map(model, action);
}
