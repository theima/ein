import { Action } from '../types-and-interfaces/action';
import { Handlers } from '../types-and-interfaces/handlers';
export function trigger<T>(handlers: Handlers<T>): (model: T, actions: Action[]) => Action[] {
  if (handlers.trigger) {
    let trigger: (model: T | null, action: Action) => Action | null = handlers.trigger;
    return (model: T, actions: Action[]) => {
      return actions.reduce((triggered: Action[], action: Action) => {
        let triggeredAction: Action | null = trigger(model, action);
        if (triggeredAction) {
          triggered.push(triggeredAction);
        }
        return triggered;
      }, []);
    };
  } else {
    return (model: T, actions: Action[]) => {
      return [];
    };
  }
}
