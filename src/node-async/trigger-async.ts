import { Observable } from 'rxjs';
import { ActionMapsWithAsync } from './action-maps-with-async';
import { Action } from '../core';
export function triggerAsync<T>(actionMaps: ActionMapsWithAsync<T>): (model: T, actions: Action[]) => Array<Observable<Action>> {
  if (actionMaps.triggerMapAsync) {
    let trigger: (model: T, action: Action) => Observable<Action> | null = actionMaps.triggerMapAsync;
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
