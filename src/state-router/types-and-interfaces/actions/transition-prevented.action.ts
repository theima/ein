import { State } from '../state';
import { StateAction } from '../state-action';
import { Action } from '../../../core';

export interface TransitionPreventedAction extends Action {
  type: StateAction.TransitionPrevented;
  from?: State;
  to?: State;
  reason?: string;
  code?: number;
}
