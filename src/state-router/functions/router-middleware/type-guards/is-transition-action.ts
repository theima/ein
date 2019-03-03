import { Action } from '../../../../core';
import { TransitionAction } from '../../../types-and-interfaces/actions/transition.action';
import { StateAction } from '../../../types-and-interfaces/state-action';

export function isTransitionAction(action: Action): action is TransitionAction {
  return action.type === StateAction.Transition;
}
