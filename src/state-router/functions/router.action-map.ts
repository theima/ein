import { Action } from '../../core';
import { StateAction } from '../types-and-interfaces/actions/state-action';
import { State } from '../types-and-interfaces/state/state';

export function routerActionMap(model: State, action: Action): State {
  if (action.type === StateAction.Transitioned) {
    return (action as any).to;
  }
  return model;
}
