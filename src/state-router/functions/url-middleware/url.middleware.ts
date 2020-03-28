
import { Action, Dict } from '../../../core';
import { PathConfig } from '../../types-and-interfaces/config/path.config';
import { State } from '../../types-and-interfaces/state/state';
import { isLastStateOfTransition } from '../is-last-state-of-transition';
import { isTransitionedAction } from '../router-middleware/type-guards/is-transitioned-action';
import { createTransitionFailedFromPathFailure } from './create-transition-failed-from-path-failure';
import { stateToUrl } from './state-to-url/state-to-url';
import { isUrlAction } from './type-guards/is-url-action';

export function urlMiddleware(paths: Dict<PathConfig>,
                              setUrl: (path: string) => void,
                              setState: (state: State) => void,
                              next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  return (following: (a: Action) => Action) => {
    return (a: Action) => {
      if (isTransitionedAction(a) && isLastStateOfTransition(a)) {
        let result: Action;
        const path = stateToUrl(paths, a.to);
        if (typeof path !== 'string') {
          const failed = createTransitionFailedFromPathFailure(path, a);
          result = next(failed);
        } else {
          if (!isUrlAction(a)) {
            setUrl(path);
          }
          setState(a.to);
          result = following(a);
        }
        return result;
      }
      return following(a);
    };
  };
}
