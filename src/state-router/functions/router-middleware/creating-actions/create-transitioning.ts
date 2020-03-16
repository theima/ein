import { InitiateTransitionAction } from '../../../types-and-interfaces/actions/initiate-transition.action';
import { TransitionedAction } from '../../../types-and-interfaces/actions/transitioned.action';
import { TransitioningAction } from '../../../types-and-interfaces/actions/transitioning.action';
import { State } from '../../../types-and-interfaces/state';
import { StateAction } from '../../../types-and-interfaces/state-action';

export function createTransitioning(action: InitiateTransitionAction | TransitionedAction, to: State, current?: State): TransitioningAction {
  let transitioning: TransitioningAction = {
    ...action,
    type: StateAction.Transitioning,
    to
  };
  if (current) {
    transitioning.from = current;
  }
  return transitioning;
}
