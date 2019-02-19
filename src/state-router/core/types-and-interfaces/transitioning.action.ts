import { State } from './state';
import { StateAction } from './state-action';
import { Action } from '../../../core';

export interface TransitioningAction extends Action {
  type: StateAction.Transitioning;
  to: State;
  from?: State;
}
