import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { Code } from '../../../types-and-interfaces/code';
import { Reason } from '../../../types-and-interfaces/reason';
import { State } from '../../../types-and-interfaces/state';
import { StateAction } from '../../../types-and-interfaces/state-action';

export function createTransitionFailedForCanEnter(state: State, error: any): TransitionFailedAction {
  return {
    type: StateAction.TransitionFailed,
    reason: Reason.CanEnterFailed,
    code: Code.CanEnterFailed,
    to: state,
    error
  };
}
