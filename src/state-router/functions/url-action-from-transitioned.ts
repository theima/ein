import { TransitionedAction } from '../types-and-interfaces/transitioned.action';
import { PathConfig } from '../types-and-interfaces/path.config';
import { Dict } from '../types-and-interfaces/dict';
import { Code } from '../types-and-interfaces/code';
import { Reason } from '../types-and-interfaces/reason';
import { StateAction } from '../types-and-interfaces/state-action';
import { stateToUrl } from './state-to-url';
import { State } from '../types-and-interfaces/state';
import { Action } from '../../model';

export function urlActionFromTransitioned(paths: Dict<PathConfig>): (action: TransitionedAction) => Action {
  const getUrl: (state: State) => string | { error: any } | null = stateToUrl(paths);
  return (transitioned: TransitionedAction) => {
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
  };
}
