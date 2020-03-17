import { State } from '../state';
import { StateAction } from '../state-action';
import { RouterTransitionAction } from './router-transition-action';

export interface TransitioningAction extends RouterTransitionAction {
  type: StateAction.Transitioning;
  from?: State;
}
