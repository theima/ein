import { Action } from '../../../../core';
import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionAction } from '../../../types-and-interfaces/actions/transition.action';

export function isTransitionAction(action: Action): action is TransitionAction {
  return action.type === StateAction.Transition;
}
