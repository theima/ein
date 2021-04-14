import { StateAction } from '../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../types-and-interfaces/actions/transition-failed.action';
import { Code } from '../../types-and-interfaces/config/code';
import { Reason } from '../../types-and-interfaces/config/reason';
import { State } from '../../types-and-interfaces/state/state';

export function createTransitionFailedForTitleFailure(to: State, error: unknown): TransitionFailedAction {
  return {
    type: StateAction.TransitionFailed,
    to,
    reason: Reason.CouldNotCreateTitle,
    code: Code.CouldNotCreateTitle,
    error,
  };
}
