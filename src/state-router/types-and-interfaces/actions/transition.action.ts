import { RouterAction } from './router.action';
import { StateAction } from './state-action';

export interface TransitionAction extends RouterAction {
  type: StateAction.Transition;
}
