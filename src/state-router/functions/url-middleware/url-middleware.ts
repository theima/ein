import { PathConfig } from '../../types-and-interfaces/path.config';
import { TransitionedAction } from '../../types-and-interfaces/actions/transitioned.action';
import { TransitionedWithPathAction } from '../../types-and-interfaces/actions/transitioned-with-url.action';
import { history } from './history';
import { State } from '../../types-and-interfaces/state';
import { Location } from 'history';
import { statesEqual } from './states-equal';
import { Action, Dict, dictToArray, partial } from '../../../core';
import { urlActionFromTransitioned } from './url-action-from-transitioned';
import { locationToState } from './location-to-state';
import { isTransitionedAction } from '../router-middleware/type-guards/is-transitioned-action';
import { isTransitionFailedAction } from '../router-middleware/type-guards/is-transition-failed-action';

export function urlMiddleware(paths: Dict<PathConfig>,
                              setUrl: (path: string) => void,
                              setState: (state: State) => void,
                              next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  const createAction: (transitioned: TransitionedAction) => Action = partial(urlActionFromTransitioned, paths);
  const getState: (location: Location) => State | null = partial(locationToState, dictToArray(paths));
  return (following: (a: Action) => Action) => {
    return (a: Action) => {
      if (isTransitionedAction(a)) {
        let urlAction: Action = createAction(a);
        let result: Action = a;
        if (isTransitionFailedAction(urlAction)) {
          next(urlAction);
        } else {
          result = following(urlAction);
          const url: string = (result as TransitionedWithPathAction).url;
          // if this doesn't exist another middleware has changed the action.
          // we'll just not update the url.
          if (url) {
            // we have to compare the url as a state because the url might differ but the resulting state is the same.
            const currentState: State = getState(history.location) as State;
            if (!statesEqual(currentState, a.to)) {
              // if this matches we do noting because this was probable the result of an update to url.
              // it could also be a transition to the same state, but then the path is the same anyway.
              setUrl(url);
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
