import { Action } from '../../../../core';
import { StateAction } from '../../../types-and-interfaces/state-action';
import { TransitioningAction } from '../../../types-and-interfaces/actions/transitioning.action';

export function isTransitioningAction(action: Action): action is TransitioningAction {
  return action.type === StateAction.Transitioning && !!action.to;
}
