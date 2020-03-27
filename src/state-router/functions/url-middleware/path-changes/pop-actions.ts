import { Location } from 'history';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Action } from '../../../../core';
import { locationChanges } from './location-changes';

export function popActions(getAction: (l: Location) => Action): Observable<Action> {
  return locationChanges().pipe(
    filter((values: [Location, 'PUSH' | 'POP' | 'REPLACE']) => {
      return values[1] === 'POP';
    }),
    map((values: [Location, 'PUSH' | 'POP' | 'REPLACE']) => {
      return getAction(values[0]);
    }));
}
