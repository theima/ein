import { Observable } from 'rxjs/Observable';
import { locationChanges } from './location-changes';
import { Location } from 'history';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { PathConfig } from '../types-and-interfaces/path.config';
import { locationToAction } from './location-to-action';
import { Action } from '../../model';

export function popActions(configs: PathConfig[]): () => Observable<Action> {
  const getAction: (l: Location) => Action = locationToAction(configs);
  return () => locationChanges().filter((values: [Location, 'PUSH' | 'POP' | 'REPLACE']) => {
    return values[1] === 'POP';
  })
    .map((values: [Location, 'PUSH' | 'POP' | 'REPLACE']) => {
      return getAction(values[0]);
    });
}
