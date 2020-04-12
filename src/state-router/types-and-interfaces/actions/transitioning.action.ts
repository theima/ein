import { State } from '../state/state';
import { ActiveTransitionAction } from './active-transition.action';
import { StateAction } from './state-action';

export interface TransitioningAction extends ActiveTransitionAction {
  type: StateAction.Transitioning;
  from?: State;
}
