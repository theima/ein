import { State } from '../state';
import { StateAction } from '../state-action';
import { RouterAction } from './router.action';

export interface TransitioningAction extends RouterAction {
  type: StateAction.Transitioning;
  from?: State;
}
