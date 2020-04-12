import { Action } from '../../../core';
import { State } from '../state/state';
import { StateAction } from './state-action';

export interface TransitionFailedAction extends Action {
  type: StateAction.TransitionFailed;
  to?: State;
  from?: State;
  reason: string;
  code: number;
  error?: any;
}
