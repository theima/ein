
import { RouterAction } from '../../../types-and-interfaces/actions/router.action';
import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { Code } from '../../../types-and-interfaces/config/code';
import { Reason } from '../../../types-and-interfaces/config/reason';
import { State } from '../../../types-and-interfaces/state/state';

export function pathToAction(pathToState: (path: string, query?: string) => State | null, path: string, query: string = ''): RouterAction | TransitionFailedAction {
  const to: State | null = pathToState(path, query);
  if (!to) {
    return {
      type: StateAction.TransitionFailed,
      reason: Reason.NoStateForLocation,
      code: Code.NoStateForLocation
    };
  }
  return {
    type: StateAction.InitiateTransition,
    to
  };
}
