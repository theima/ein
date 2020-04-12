import { Action } from '../../../../core';
import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';

export function isTransitionFailedAction(action: Action): action is TransitionFailedAction {
  return action.type === StateAction.TransitionFailed;
}
