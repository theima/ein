import { InitiateTransitionAction } from '../../../types-and-interfaces/actions/initiate-transition.action';
import { StateAction } from '../../../types-and-interfaces/state-action';
import { Action } from '../../../../core';

export function isInitiateTransitionAction(action: Action): action is InitiateTransitionAction {
  return action.type === StateAction.InitiateTransition;
}
