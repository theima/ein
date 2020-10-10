import { StateAction } from '../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../types-and-interfaces/actions/transition-failed.action';
import { TransitionedAction } from '../../types-and-interfaces/actions/transitioned.action';
import { Code } from '../../types-and-interfaces/config/code';
import { Reason } from '../../types-and-interfaces/config/reason';

export function createTransitionFailedFromPathFailure(transitioned: TransitionedAction, error?: { error: any }): TransitionFailedAction {
  const action: TransitionFailedAction = {
    type: StateAction.TransitionFailed,
    to: transitioned.to,
    reason: Reason.CouldNotBuildUrl,
    code: Code.CouldNotBuildUrl,
    error
  };

  if (transitioned.from) {
    action.from = transitioned.from;
  }
  return action;
}
