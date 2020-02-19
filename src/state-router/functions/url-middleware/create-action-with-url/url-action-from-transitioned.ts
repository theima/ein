import { Dict } from '../../../../core';
import { partial } from '../../../../core/functions/partial';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { TransitionedWithPathAction } from '../../../types-and-interfaces/actions/transitioned-with-path.action';
import { TransitionedAction } from '../../../types-and-interfaces/actions/transitioned.action';
import { Code } from '../../../types-and-interfaces/code';
import { PathConfig } from '../../../types-and-interfaces/path.config';
import { Reason } from '../../../types-and-interfaces/reason';
import { State } from '../../../types-and-interfaces/state';
import { StateAction } from '../../../types-and-interfaces/state-action';
import { stateToUrl } from './state-to-url';

export function urlActionFromTransitioned(paths: Dict<PathConfig>, transitioned: TransitionedAction): TransitionFailedAction | TransitionedWithPathAction {
  const getUrl: (state: State) => string | { error: any } | null = partial(stateToUrl, paths);
  let action: TransitionFailedAction | TransitionedWithPathAction;
  const urlOrError: string | { error: any } | null = getUrl(transitioned.to);
  if (urlOrError) {
    if (typeof urlOrError === 'string') {
      action = {...transitioned, path: urlOrError};
    } else {
      action = {
        type: StateAction.TransitionFailed,
        to: transitioned.to,
        reason: Reason.CouldNotBuildUrl,
        code: Code.CouldNotBuildUrl,
        error: urlOrError
      };
    }
  } else {
    action = {
      type: StateAction.TransitionFailed,
      from: transitioned.from,
      to: transitioned.to,
      reason: Reason.NoPathMap,
      code: Code.NoPathMap
    };
  }
  if (action.type === StateAction.TransitionFailed && transitioned.from) {
    (action as any).from = transitioned.from;
  }
  return action;
}
