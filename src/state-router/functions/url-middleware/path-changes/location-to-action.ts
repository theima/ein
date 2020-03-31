import { Location } from 'history';
import { Action } from '../../../../core';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { UrlAction } from '../../../types-and-interfaces/actions/url.action';

export function locationToAction(pathToAction: (part: string, query?: string) => UrlAction | TransitionFailedAction, location: Location): Action {
  const path: string = location.pathname;
  const query: string = location.search;
  return pathToAction(path, query);

}
