import { Location } from 'history';
import { Dict } from '../../../core';
import { PathStateDescriptor } from '../../types-and-interfaces/config/descriptor/path.state-descriptor';
import { State } from '../../types-and-interfaces/state/state';
import { pathToState } from './path-changes/path-to-state';

export function locationToState(descriptors: Dict<PathStateDescriptor>, location: Location): State | null {
  const path: string = location.pathname;
  const query: string = location.search;
  return pathToState(descriptors, path, query);
}
