import { Action } from '../../node/types-and-interfaces/action';
import { ActionMaps } from '../../node/types-and-interfaces/action-maps';

export function mapAction<T>(maps: ActionMaps<T>, model: T, action: Action): T {
  let map: (model: T, action: Action) => T = maps.actionMap;
  return map(model, action);
}
