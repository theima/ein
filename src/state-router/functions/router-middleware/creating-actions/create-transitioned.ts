import { TransitionedAction } from '../../../types-and-interfaces/actions/transitioned.action';
import { TransitioningAction } from '../../../types-and-interfaces/actions/transitioning.action';
import { StateAction } from '../../../types-and-interfaces/state-action';

export function createTransitioned(transitioning: TransitioningAction, data: object): TransitionedAction {
  let transitionedAction: TransitionedAction = {
    ...transitioning,
    type: StateAction.Transitioned,
    data
  };
  return transitionedAction;
}
