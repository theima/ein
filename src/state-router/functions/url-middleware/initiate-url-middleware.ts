import { Location } from 'history';
import { merge, ReplaySubject, Subject } from 'rxjs';
import { Action, Dict, Middleware, partial } from '../../../core';
import { linkActiveExtender } from '../../extenders/link-active.extender';
import { linkExtender } from '../../extenders/link.extender';
import { PathStateDescriptor } from '../../types-and-interfaces/config/descriptor/path.state-descriptor';
import { Extend } from '../../types-and-interfaces/extend';
import { HistoryId } from '../../types-and-interfaces/history.id';
import { State } from '../../types-and-interfaces/state/state';
import { createPushUrl } from './create-push-url';
import { getLocationState } from './path-changes/get-location-state';
import { history } from './path-changes/history';
import { locationActions } from './path-changes/location-actions';
import { locationChanges } from './path-changes/location-changes';
import { locationToAction } from './path-changes/location-to-action';
import { pathToAction } from './path-changes/path-to-action';
import { pathToState } from './path-changes/path-to-state';
import { restoreHistory } from './path-changes/restore-history';
import { urlMiddleware } from './url.middleware';

export function initiateUrlMiddleware(paths: Dict<PathStateDescriptor>): Extend {
  const toState = partial(pathToState, paths);
  const toAction = partial(pathToAction, toState);

  let historyId: HistoryId = getLocationState(history.location);
  let blockNext: boolean = false;
  const newHistoryId = () => {
    historyId = { id: historyId.id + 1 };
    return historyId;
  };
  const getHistoryId = () => historyId;
  const setHistoryId = (id: HistoryId) => {
    historyId = id;
  };
  const shouldAct = () => {
    const shouldAct = !blockNext;
    blockNext = false;
    return shouldAct;
  };
  const setBlockNext = () => {
    blockNext = true;
  };
  const stateChanges: ReplaySubject<State> = new ReplaySubject(1);
  const stateChanged = (s: State) => {
    stateChanges.next(s);
  };
  const middleware: Middleware = partial(
    urlMiddleware,
    paths,
    partial(restoreHistory, setBlockNext),
    createPushUrl(history, newHistoryId),
    stateChanged
  );
  const actionChanges = new ReplaySubject<Location>(1);
  locationChanges().subscribe((location) => {
    actionChanges.next(location);
    setHistoryId(getLocationState(location));
  });

  const linkSubject = new Subject<Action>();
  const linkActions = (a: Action) => {
    linkSubject.next(a);
  };

  const actions = merge(
    locationActions(actionChanges, partial(locationToAction, toAction, getHistoryId), shouldAct),
    linkSubject
  );

  return {
    extenders: [linkExtender(toAction, linkActions), linkActiveExtender(toState, stateChanges)],
    middlewares: [middleware],
    actions,
  };
}
