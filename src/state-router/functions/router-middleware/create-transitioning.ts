import { TransitioningAction } from '../../types-and-interfaces/actions/transitioning.action';
import { State } from '../../types-and-interfaces/state';
import { StateAction } from '../../types-and-interfaces/state-action';

export function createTransitioning(to: State, current: State): TransitioningAction {
  let transitioning: TransitioningAction = {
    type: StateAction.Transitioning,
    to
  };
  if (current) {
    transitioning.from = current;
  }
  return transitioning;
}
