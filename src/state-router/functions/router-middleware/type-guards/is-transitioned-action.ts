import { Action } from '../../../../core';
import { TransitionedAction } from '../../../types-and-interfaces/actions/transitioned.action';
import { StateAction } from '../../../types-and-interfaces/state-action';

export function isTransitionedAction(action: Action): action is TransitionedAction {
  return action.type === StateAction.Transitioned;
}
