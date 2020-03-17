import { State } from '../state';
import { StateAction } from '../state-action';
import { RouterTransitionAction } from './router-transition-action';

export interface TransitionedAction extends RouterTransitionAction {
  type: StateAction.Transitioned;
  to: State;
  from?: State;
  data: object;
}
