import { merge, ReplaySubject, Subject } from 'rxjs';
import { Action, Dict, Middleware, partial } from '../../../core';
import { ExtenderDescriptor } from '../../../html-renderer';
import { linkActiveExtender } from '../../extenders/link-active.extender';
import { linkExtender } from '../../extenders/link.extender';
import { PathStateDescriptor } from '../../types-and-interfaces/config/descriptor/path.state-descriptor';
import { Extend } from '../../types-and-interfaces/extend';
import { State } from '../../types-and-interfaces/state/state';
import { locationToAction } from './path-changes/location-to-action';
import { pathToAction } from './path-changes/path-to-action';
import { pathToState } from './path-changes/path-to-state';
import { popActions } from './path-changes/pop-actions';
import { pushUrl } from './push-url';
import { urlMiddleware } from './url.middleware';

export function initiateUrlMiddleware(paths: Dict<PathStateDescriptor>): Extend {
  const stateChanges: ReplaySubject<State> = new ReplaySubject(1);
  const stateChanged = (s: State) => {
    stateChanges.next(s);
  };
  const middleware: Middleware = partial(urlMiddleware, paths, pushUrl, stateChanged);
  const linkSubject = new Subject<Action>();
  const linkActions = (a: Action) => {
    linkSubject.next(a);
  };
  const toState = partial(pathToState, paths);
  const toAction = partial(pathToAction, toState);

  const actions = merge(popActions(partial(locationToAction, toAction)), linkSubject);

  const link: ExtenderDescriptor = linkExtender(toAction, linkActions);
  const linkActive: ExtenderDescriptor = linkActiveExtender(toState, stateChanges);

  return {
    extenders: [link, linkActive],
    middlewares: [middleware],
    actions
  };
}
