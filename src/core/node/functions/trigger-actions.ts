import { Action } from '../types-and-interfaces/action';
import { TriggerMap } from '../types-and-interfaces/trigger-map';

export function triggerActions<T>(triggerMap: TriggerMap<T> | undefined, model: T, actions: Action[]): Action[] {
  let map;
  if (triggerMap) {
    let trigger: (model: T, action: Action) => Action | null = triggerMap;
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
