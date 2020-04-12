import { Action } from '../../../../core';
import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionPreventedAction } from '../../../types-and-interfaces/actions/transition-prevented.action';

export function isTransitionPreventedAction(action: Action): action is TransitionPreventedAction {
  return action.type === StateAction.TransitionPrevented;
}
