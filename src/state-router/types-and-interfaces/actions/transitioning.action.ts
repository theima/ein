import { Action } from '../../../core';
import { State } from '../state';
import { StateAction } from '../state-action';

export interface TransitioningAction extends Action {
  type: StateAction.Transitioning;
  to: State;
  from?: State;
}
