import { Action } from '../../../../core';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { StateAction } from '../../../types-and-interfaces/state-action';

export function isTransitionFailedAction(action: Action): action is TransitionFailedAction {
  return action.type === StateAction.TransitionFailed;
}
