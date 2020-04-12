import { Location } from 'history';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RouterAction } from '../../../types-and-interfaces/actions/router.action';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { UrlAction } from '../../../types-and-interfaces/actions/url.action';
import { isTransitionFailedAction } from '../../router-middleware/type-guards/is-transition-failed-action';
import { locationChanges } from './location-changes';

export function popActions(getAction: (l: Location) => RouterAction | TransitionFailedAction): Observable<UrlAction | TransitionFailedAction> {
  return locationChanges().pipe(
    filter((values: [Location, 'PUSH' | 'POP' | 'REPLACE']) => {
      return values[1] === 'POP';
    }),
    map((values: [Location, 'PUSH' | 'POP' | 'REPLACE']) => {
      const action = getAction(values[0]);
      if(isTransitionFailedAction(action)) {
        return action;
      }
      return {...action, originatedFromLocationChange: true};
    }));
}
