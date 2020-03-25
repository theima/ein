import { State } from '../state/state';
import { RouterTransitionAction } from './router-transition-action';
import { StateAction } from './state-action';

export interface TransitionedAction extends RouterTransitionAction {
  type: StateAction.Transitioned;
  to: State;
  from?: State;
  data: object;
}
