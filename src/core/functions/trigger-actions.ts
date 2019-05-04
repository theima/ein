import { Action } from '../types-and-interfaces/action';
import { ActionMaps } from '../types-and-interfaces/action-maps';

export function triggerActions<T>(actionMaps: ActionMaps<T>, model: T, actions: Action[]): Action[] {
  let map;
  if (actionMaps.triggerMap) {
    let trigger: (model: T, action: Action) => Action | null = actionMaps.triggerMap;
    map = (model: T, actions: Action[]) => {
      return actions.reduce((triggered: Action[], action: Action) => {
        let triggeredAction: Action | null = trigger(model, action);
        if (triggeredAction) {
          triggered.push(triggeredAction);
        }
        return triggered;
      }, []);
    };
  }
  if (map) {
    return map(model, actions);
  }
  return [];
}
