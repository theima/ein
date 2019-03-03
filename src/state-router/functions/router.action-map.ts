import { State } from '../types-and-interfaces/state';
import { StateAction } from '../types-and-interfaces/state-action';
import { Action } from '../../core';

export function routerActionMap(model: State, action: Action): State {
  if (action.type === StateAction.Transitioned) {
    return (action as any).to;
  }
  return model;
}
