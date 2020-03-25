import { State } from '../state/state';
import { RouterTransitionAction } from './router-transition-action';
import { StateAction } from './state-action';

export interface TransitioningAction extends RouterTransitionAction {
  type: StateAction.Transitioning;
  from?: State;
}
