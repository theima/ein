import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionedAction } from '../../../types-and-interfaces/actions/transitioned.action';
import { TransitioningAction } from '../../../types-and-interfaces/actions/transitioning.action';

export function createTransitioned(transitioning: TransitioningAction, data: object): TransitionedAction {
  const transitionedAction: TransitionedAction = {
    ...transitioning,
    type: StateAction.Transitioned,
    data,
  };
  return transitionedAction;
}
