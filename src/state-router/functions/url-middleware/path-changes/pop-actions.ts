import { Location } from 'history';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Action, partial } from '../../../../core';
import { PathConfig } from '../../../types-and-interfaces/path.config';
import { locationChanges } from './location-changes';
import { locationToAction } from './location-to-action';

export function popActions(configs: PathConfig[]): Observable<Action> {
  const getAction: (l: Location) => Action = partial(locationToAction, configs);
  return locationChanges().pipe(
    filter((values: [Location, 'PUSH' | 'POP' | 'REPLACE']) => {
      return values[1] === 'POP';
    }),
    map((values: [Location, 'PUSH' | 'POP' | 'REPLACE']) => {
      return getAction(values[0]);
    }));
}
