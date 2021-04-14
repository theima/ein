import { RouterAction } from '../../../types-and-interfaces/actions/router.action';
import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { Code } from '../../../types-and-interfaces/config/code';
import { Reason } from '../../../types-and-interfaces/config/reason';

export function createTransitionFailedForCanEnter(action: RouterAction, error: unknown): TransitionFailedAction {
  return {
    ...action,
    type: StateAction.TransitionFailed,
    reason: Reason.CanEnterFailed,
    code: Code.CanEnterFailed,
    error,
  };
}
