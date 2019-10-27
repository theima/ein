import { Location } from 'history';
import { PathConfig } from '../../types-and-interfaces/path.config';
import { State } from '../../types-and-interfaces/state';
import { pathToState } from './path-to-state';

export function locationToState(configs: PathConfig[], location: Location): State | null {
  const path: string = location.pathname;
  const query: string = location.search;
  return pathToState(configs, path, query);
}
