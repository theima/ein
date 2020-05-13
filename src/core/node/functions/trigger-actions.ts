import { Action } from '../types-and-interfaces/action';
import { Trigger } from '../types-and-interfaces/trigger';

export function triggerActions<T>(trigger: Trigger<T> | undefined, model: T, actions: Action[]): Action[] {
  let map;
  if (trigger) {
    map = (model: T, actions: Action[]) => {
      return actions.reduce((triggered: Action[], action: Action) => {
        let triggeredAction: Action | undefined = trigger(model, action);
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
