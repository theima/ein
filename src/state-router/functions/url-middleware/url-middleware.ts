import { PathConfig } from '../../types-and-interfaces/path.config';
import { TransitionedAction } from '../../types-and-interfaces/transitioned.action';
import { TransitionedWithPathAction } from '../../types-and-interfaces/transitioned-with-url.action';
import { StateAction } from '../../types-and-interfaces/state-action';
import { urlActionFromTransitioned } from './functions/url-action-from-transitioned';
import { history } from './history';
import { State } from '../../types-and-interfaces/state';
import { locationToState } from './functions/location-to-state';
import { Location } from 'history';
import { statesEqual } from '../states-equal';
import { Action, Dict, dictToArray, partial } from '../../../core';

export function urlMiddleware(paths: Dict<PathConfig>, setUrl: (path: string) => void, next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  const createAction: (transitioned: TransitionedAction) => Action = partial(urlActionFromTransitioned, paths);
  const getState: (location: Location) => State | null = partial(locationToState, dictToArray(paths));
  return (following: (a: Action) => Action) => {
    return (a: Action) => {
      if (a.type === StateAction.Transitioned) {
        const transitioned: TransitionedAction = a as any;
        let urlAction: Action = createAction(transitioned);
        let result: Action = a;
        if (urlAction.type === StateAction.TransitionFailed) {
          next(urlAction);
        } else {
          result = following(urlAction) as TransitionedWithPathAction;
          const url: string = (result as any).url;
          // if this doesn't exist another middleware has changed the action.
          // we'll just not update the url.
          if (url) {
            // we have to compare the url as a state because the url might differ but the resulting state is the same.
            const currentState: State = getState(history.location) as State;
            if (!statesEqual(currentState, transitioned.to)) {
              // if this matches we do noting because this was probable the result of an update to url.
              // it could also be a transition to the same state, but then the path is the same anyway.
              setUrl(url);
            }
          }
        }
        return result;
      }
      return following(a);
    };
  };
}
