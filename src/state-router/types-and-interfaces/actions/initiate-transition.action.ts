import { RouterAction } from './router.action';
import { StateAction } from './state-action';

export interface InitiateTransitionAction extends RouterAction {
  type: StateAction.InitiateTransition;
}
