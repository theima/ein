import { Location } from 'history';
import { Action } from '../../../core';
import { PathConfig } from '../../types-and-interfaces/path.config';
import { pathToAction } from './path-to-action';

export function locationToAction(configs: PathConfig[], location: Location): Action {
  const path: string = location.pathname;
  const query: string = location.search;
  return pathToAction(configs, path, query);

}
