import { Action } from '../types-and-interfaces/action';
import { Trigger } from '../types-and-interfaces/trigger';

export function triggerActions<T>(trigger: Trigger<T> | undefined, model: T, actions: Action[]): Action[] {
  let map;
  if (trigger) {
    map = (m: T, as: Action[]) => {
      return as.reduce((triggered: Action[], action: Action) => {
        const triggeredAction: Action | undefined = trigger(m, action);
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
