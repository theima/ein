import { Stack } from '../../../../core';
import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionAction } from '../../../types-and-interfaces/actions/transition.action';
import { TransitionedAction } from '../../../types-and-interfaces/actions/transitioned.action';
import { TransitioningAction } from '../../../types-and-interfaces/actions/transitioning.action';
import { State } from '../../../types-and-interfaces/state/state';

export function createTransitioning(
  action: TransitionAction | TransitionedAction,
  remainingStates: Stack<State>,
  to: State,
  current?: State
): TransitioningAction {
  const transitioning: TransitioningAction = {
    ...action,
    type: StateAction.Transitioning,
    to,
    remainingStates
  };
  if (current) {
    transitioning.from = current;
  }
  return transitioning;
}
