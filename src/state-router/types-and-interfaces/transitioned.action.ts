import { State } from './state';
import { StateAction } from './state-action';
import { Action } from '../../model';

export interface TransitionedAction extends Action {
  type: StateAction.Transitioned;
  to: State;
  from?: State;
  data: object;
}
