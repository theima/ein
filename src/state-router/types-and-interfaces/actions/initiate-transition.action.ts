import { StateAction } from '../state-action';
import { RouterAction } from './router.action';

export interface InitiateTransitionAction extends RouterAction {
  type: StateAction.InitiateTransition;
}
