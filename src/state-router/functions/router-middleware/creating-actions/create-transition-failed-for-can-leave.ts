import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { Code } from '../../../types-and-interfaces/config/code';
import { Reason } from '../../../types-and-interfaces/config/reason';
import { State } from '../../../types-and-interfaces/state/state';

export function createTransitionFailedForCanLeave(state: State, error: any): TransitionFailedAction {
  return {
    type: StateAction.TransitionFailed,
    reason: Reason.CanLeaveFailed,
    code: Code.CanLeaveFailed,
    from: state,
    error
  };
}
