import { Location } from 'history';
import { RouterAction } from '../../../types-and-interfaces/actions/router.action';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';

export function locationToAction(pathToAction: (part: string, query?: string) => RouterAction | TransitionFailedAction, location: Location): RouterAction | TransitionFailedAction {
  const path: string = location.pathname;
  const query: string = location.search;
  return pathToAction(path, query);

}
