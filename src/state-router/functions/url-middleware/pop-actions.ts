import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { locationChanges } from './location-changes';
import { Location } from 'history';
import { PathConfig } from '../../types-and-interfaces/path.config';
import { locationToAction } from './location-to-action';
import { Action, partial } from '../../../core';

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
