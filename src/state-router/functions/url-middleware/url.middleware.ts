
import { Action, Dict, partial } from '../../../core';
import { propertyFromDict } from '../../../core/functions/dict/property-from-dict';
import { LocationAction } from '../../types-and-interfaces/actions/location.action';
import { PathStateDescriptor } from '../../types-and-interfaces/config/descriptor/path.state-descriptor';
import { State } from '../../types-and-interfaces/state/state';
import { isLastStateOfTransition } from '../is-last-state-of-transition';
import { isTransitionFailedAction } from '../router-middleware/type-guards/is-transition-failed-action';
import { isTransitionPreventedAction } from '../router-middleware/type-guards/is-transition-prevented-action';
import { isTransitionedAction } from '../router-middleware/type-guards/is-transitioned-action';
import { createTransitionFailedFromPathFailure } from './create-transition-failed-from-path-failure';
import { stateToPath } from './state-to-path/state-to-path';
import { isLocationAction } from './type-guards/is-location-action';

export function urlMiddleware(paths: Dict<PathStateDescriptor>,
                              restoreHistory: (action:LocationAction) => void,
                              setUrl: (path: string) => void,
                              setState: (state: State) => void,
                              next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  const getPathMap: (name: string) => string = partial(propertyFromDict, paths, 'path' as any, '');
  const toPath = partial(stateToPath, getPathMap);

  return (following: (a: Action) => Action) => {
    return (a: Action) => {
      if (isTransitionedAction(a) && isLastStateOfTransition(a)) {
        let result: Action;
        const path = toPath(a.to);
        if (typeof path !== 'string') {
          const failed = createTransitionFailedFromPathFailure(a, path);
          result = next(failed);
        } else {
          if (!isLocationAction(a)) {
            setUrl(path);
          }
          setState(a.to);
          result = following(a);
        }
        return result;
      }
      if (isTransitionFailedAction(a) || isTransitionPreventedAction(a)) {
        if (isLocationAction(a)) {
          restoreHistory(a);
        }
      }
      return following(a);
    };
  };
}
