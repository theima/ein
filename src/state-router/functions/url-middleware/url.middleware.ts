import { Location } from 'history';
import { Action, Dict, dictToArray, partial } from '../../../core';
import { TransitionedAction } from '../../types-and-interfaces/actions/transitioned.action';
import { PathConfig } from '../../types-and-interfaces/path.config';
import { State } from '../../types-and-interfaces/state';
import { isTransitionFailedAction } from '../router-middleware/type-guards/is-transition-failed-action';
import { isTransitionedAction } from '../router-middleware/type-guards/is-transitioned-action';
import { urlActionFromTransitioned } from './create-action-with-url/url-action-from-transitioned';
import { locationToState } from './location-to-state';
import { history } from './path-changes/history';
import { statesEqual } from './states-equal';

export function urlMiddleware(paths: Dict<PathConfig>,
                              setUrl: (path: string) => void,
                              setState: (state: State) => void,
                              next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  const createAction: (transitioned: TransitionedAction) => Action = partial(urlActionFromTransitioned, paths);
  const getState: (location: Location) => State | null = partial(locationToState, dictToArray(paths));
  return (following: (a: Action) => Action) => {
    return (a: Action) => {
      if (isTransitionedAction(a)) {
        let pathAction = createAction(a);
        let result: Action = a;
        if (isTransitionFailedAction(pathAction)) {
          next(pathAction);
        } else {
          result = following(pathAction);
          const path: string = result.path;
          // if this doesn't exist another middleware has changed the action.
          // we'll just not update the url.
          if (path) {
            // we have to compare the url as a state because the url might differ but the resulting state is the same.
            const currentState: State = getState(history.location) as State;
            if (!statesEqual(currentState, a.to)) {
              // if this matches we do noting because this was probably the result of an update to url.
              // it could also be a transition to the same state, but then the path is the same anyway.
              setUrl(path);
            }
          }
          setState(a.to);
        }
        return result;
      }
      return following(a);
    };
  };
}
