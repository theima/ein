import { Action } from '../../../../core';
import { TransitionPreventedAction } from '../../../types-and-interfaces/actions/transition-prevented.action';
import { StateAction } from '../../../types-and-interfaces/state-action';

export function isTransitionPreventedAction(action: Action): action is TransitionPreventedAction {
  return action.type === StateAction.TransitionPrevented;
}
