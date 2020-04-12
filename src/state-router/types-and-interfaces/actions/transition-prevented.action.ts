import { Action } from '../../../core';
import { State } from '../state/state';
import { StateAction } from './state-action';

export interface TransitionPreventedAction extends Action {
  type: StateAction.TransitionPrevented;
  from?: State;
  to?: State;
  reason?: string;
  code?: number;
}
