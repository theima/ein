import { Action } from '../../../../core';
import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionedAction } from '../../../types-and-interfaces/actions/transitioned.action';

export function isTransitionedAction(
  action: Action
): action is TransitionedAction {
  return action.type === StateAction.Transitioned;
}
