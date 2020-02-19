import { merge, ReplaySubject, Subject } from 'rxjs';
import { Action, arrayToDict, Dict, Middleware, partial } from '../../../core';
import { ExtenderDescriptor } from '../../../html-renderer';
import { linkActiveExtender } from '../../extenders/link-active.extender';
import { linkExtender } from '../../extenders/link.extender';
import { PathConfig } from '../../types-and-interfaces/path.config';
import { State } from '../../types-and-interfaces/state';
import { popActions } from './path-changes/pop-actions';
import { pushUrl } from './push-url';
import { urlMiddleware } from './url.middleware';

export function initiateUrlMiddleware(pathConfigs: PathConfig[]) {
  const paths: Dict<PathConfig> = arrayToDict('name', pathConfigs);
  const stateChanges: ReplaySubject<State> = new ReplaySubject(1);
  const stateChanged = (s: State) => {
    stateChanges.next(s);
  };
  const middleware: Middleware = partial(urlMiddleware, paths, pushUrl, stateChanged);
  const linkSubject = new Subject<Action>();
  const linkActions = (a: Action) => {
    linkSubject.next(a);
  };
  const actions = merge(popActions(pathConfigs), linkSubject);
  const link: ExtenderDescriptor = linkExtender(pathConfigs, linkActions);
  const linkActive: ExtenderDescriptor = linkActiveExtender(pathConfigs, stateChanges);

  return {
    link,
    linkActive,
    middleware,
    actions
  };
}
