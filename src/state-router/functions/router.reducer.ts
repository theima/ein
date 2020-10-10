import { Action } from '../../core';
import { StateAction } from '../types-and-interfaces/actions/state-action';
import { State } from '../types-and-interfaces/state/state';
import { isTransitionedAction } from './router-middleware/type-guards/is-transitioned-action';

export function routerReducer(model: State, action: Action): State {
  if (isTransitionedAction(action)) {
    return action.to;
  }
  return model;
}
