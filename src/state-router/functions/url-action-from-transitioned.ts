import { TransitionedAction } from '../types-and-interfaces/transitioned.action';
import { PathConfig } from '../types-and-interfaces/path.config';
import { Code } from '../types-and-interfaces/code';
import { Reason } from '../types-and-interfaces/reason';
import { StateAction } from '../types-and-interfaces/state-action';
import { stateToUrl } from './state-to-url';
import { State } from '../types-and-interfaces/state';
import { Action, Dict } from '../../core';
import { partial } from '../../core/functions/partial';

export function urlActionFromTransitioned(paths: Dict<PathConfig>, transitioned: TransitionedAction): Action {
  const getUrl: (state: State) => string | { error: any } | null = partial(stateToUrl, paths);
  let action: Action;
  const urlOrError: string | { error: any } | null = getUrl(transitioned.to);
  if (urlOrError) {
    if (typeof urlOrError === 'string') {
      action = {...transitioned, url: urlOrError};
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
