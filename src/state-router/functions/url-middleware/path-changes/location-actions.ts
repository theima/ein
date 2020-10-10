import { Location } from 'history';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LocationAction } from '../../../types-and-interfaces/actions/location.action';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';

export function locationActions(
  s: Observable<Location>,
  toAction: (l: Location) => LocationAction | TransitionFailedAction,
  shouldAct: () => boolean
): Observable<LocationAction | TransitionFailedAction> {
  return s.pipe(
    filter((location: Location) => {
      return shouldAct();
    }),
    map((location: Location) => {
      return toAction(location);
    })
  );
}
