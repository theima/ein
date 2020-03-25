import { Action } from '../../../../core';
import { InitiateTransitionAction } from '../../../types-and-interfaces/actions/initiate-transition.action';
import { StateAction } from '../../../types-and-interfaces/actions/state-action';

export function isInitiateTransitionAction(action: Action): action is InitiateTransitionAction {
  return action.type === StateAction.InitiateTransition;
}
