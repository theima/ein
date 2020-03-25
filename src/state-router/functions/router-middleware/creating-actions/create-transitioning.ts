import { Stack } from '../../../../core';
import { InitiateTransitionAction } from '../../../types-and-interfaces/actions/initiate-transition.action';
import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionedAction } from '../../../types-and-interfaces/actions/transitioned.action';
import { TransitioningAction } from '../../../types-and-interfaces/actions/transitioning.action';
import { State } from '../../../types-and-interfaces/state/state';

export function createTransitioning(action: InitiateTransitionAction | TransitionedAction, remainingStates: Stack<State>, to: State, current?: State): TransitioningAction {
  let transitioning: TransitioningAction = {
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
