import { Action } from '../../../../core';
import { TransitioningAction } from '../../../types-and-interfaces/actions/transitioning.action';
import { StateAction } from '../../../types-and-interfaces/state-action';

export function isTransitioningAction(action: Action): action is TransitioningAction {
  return action.type === StateAction.Transitioning && !!action.to;
}
