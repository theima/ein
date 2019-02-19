import { State } from './state';
import { StateAction } from './state-action';
import { Action } from '../../core';

export interface TransitionedAction extends Action {
  type: StateAction.Transitioned;
  to: State;
  from?: State;
  data: object;
}
