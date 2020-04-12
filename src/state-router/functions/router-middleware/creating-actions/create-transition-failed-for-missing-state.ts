import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { Code } from '../../../types-and-interfaces/config/code';
import { Reason } from '../../../types-and-interfaces/config/reason';

export function createTransitionFailedForMissingState(name: string | undefined): TransitionFailedAction {
  return {
    type: StateAction.TransitionFailed,
    reason: !!name ? Reason.NoState : Reason.NoStateName,
    code: !!name ? Code.NoState : Code.NoStateName
  };
}
