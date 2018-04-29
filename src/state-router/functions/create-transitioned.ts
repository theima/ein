import { TransitioningAction } from '../types-and-interfaces/transitioning.action';
import { TransitionedAction } from '../types-and-interfaces/transitioned.action';
import { StateAction } from '../types-and-interfaces/state-action';

export function createTransitioned(transitioning: TransitioningAction, data: object): TransitionedAction {
  let transitionedAction: TransitionedAction = {
    type: StateAction.Transitioned,
    to: transitioning.to,
    data
  };
  if (transitioning.from) {
    transitionedAction.from = transitioning.from;
  }
  return transitionedAction;
}