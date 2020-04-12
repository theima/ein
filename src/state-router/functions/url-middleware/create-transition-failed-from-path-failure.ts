import { StateAction } from '../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../types-and-interfaces/actions/transition-failed.action';
import { TransitionedAction } from '../../types-and-interfaces/actions/transitioned.action';
import { Code } from '../../types-and-interfaces/config/code';
import { Reason } from '../../types-and-interfaces/config/reason';

export function createTransitionFailedFromPathFailure(errorOrNull: { error: any } | null, transitioned: TransitionedAction): TransitionFailedAction {
  let action: TransitionFailedAction = {
    type: StateAction.TransitionFailed,
    to: transitioned.to,
    reason: Reason.CouldNotBuildUrl,
    code: Code.CouldNotBuildUrl,
    error: errorOrNull
  };

  if (action.type === StateAction.TransitionFailed && transitioned.from) {
    (action as any).from = transitioned.from;
  }
  return action;
}
