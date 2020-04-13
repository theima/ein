import { Location } from 'history';
import { LocationAction } from '../../../types-and-interfaces/actions/location.action';
import { RouterAction } from '../../../types-and-interfaces/actions/router.action';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { LocationChangeDirection } from '../../../types-and-interfaces/location-change-direction';
import { isTransitionFailedAction } from '../../router-middleware/type-guards/is-transition-failed-action';
import { getLocationState } from './get-location-state';

export function locationToAction(pathToAction: (path: string,
                                                query?: string) => RouterAction | TransitionFailedAction,
                                 currentHistoryId: () => number,
                                 location: Location
): LocationAction | TransitionFailedAction {
  const path: string = location.pathname;
  const query: string = location.search;
  const action = pathToAction(path, query);
  if (isTransitionFailedAction(action)) {
    return action;
  }
  const locationId: any = getLocationState(location);
  let direction: LocationChangeDirection = LocationChangeDirection.Unknown;
  const current = currentHistoryId();
  if (current > locationId) {
    direction = LocationChangeDirection.Backward;
  } else if (current < locationId) {
    direction = LocationChangeDirection.Forward;
  }

  return {
    ...action,
    originatedFromLocationChange: true,
    direction
  };
}
