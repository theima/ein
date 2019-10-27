import { Action } from '../../../core';
import { State } from '../state';
import { StateAction } from '../state-action';

export interface TransitionedAction extends Action {
  type: StateAction.Transitioned;
  to: State;
  from?: State;
  data: object;
}
