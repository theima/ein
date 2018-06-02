import { Observable } from 'rxjs';
import { HandlersWithAsync } from './handlers-with-async';
import { Action } from '../model';
export function triggerAsync<T>(handlers: HandlersWithAsync<T>): (model: T, actions: Action[]) => Array<Observable<Action>> {
  if (handlers.triggerAsync) {
    let trigger: (model: T | null, action: Action) => Observable<Action> | null = handlers.triggerAsync;
    return (model: T, actions: Action[]) => {
      return actions.reduce((triggered: Array<Observable<Action>>, action: Action) => {
        let triggeredAsync: Observable<Action> | null = trigger(model, action);
        if (triggeredAsync) {
          triggered.push(triggeredAsync);
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
