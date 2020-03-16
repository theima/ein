import { Location } from 'history';
import { Action, Dict, dictToArray, partial } from '../../../core';
import { PathConfig } from '../../types-and-interfaces/path.config';
import { State } from '../../types-and-interfaces/state';
import { createTransitionFailedFromPathFailure } from '../router-middleware/creating-actions/create-transition-failed-from-path-failure';
import { isTransitionedAction } from '../router-middleware/type-guards/is-transitioned-action';
import { locationToState } from './location-to-state';
import { history } from './path-changes/history';
import { stateToUrl } from './state-to-url/state-to-url';
import { statesEqual } from './states-equal';

export function urlMiddleware(paths: Dict<PathConfig>,
                              setUrl: (path: string) => void,
                              setState: (state: State) => void,
                              next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  const getState: (location: Location) => State | null = partial(locationToState, dictToArray(paths));
  return (following: (a: Action) => Action) => {
    return (a: Action) => {
      if (isTransitionedAction(a)) {
        let result: Action;
        const path = stateToUrl(paths, a.to);
        if (typeof path !== 'string') {
          const failed = createTransitionFailedFromPathFailure(path, a);
          result = next(failed);
        } else {
            result = following(a);
            const currentState: State = getState(history.location) as State;
            if (!statesEqual(currentState, a.to)) {
              // we have to compare the url as a state because the url might differ but the resulting state is the same.
              // if this matches we do noting because this was probably the result of an update to url.
              // it could also be a transition to the same state, but then the path is the same anyway.
              setUrl(path);
            }
            setState(a.to);

        }

        return result;
      }
      return following(a);
    };
  };
}
