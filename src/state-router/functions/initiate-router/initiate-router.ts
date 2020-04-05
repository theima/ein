import { Observable } from 'rxjs';
import { Action, arrayToDict, Dict, Middleware } from '../../../core';
import { partial } from '../../../core/functions/partial';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { StateConfig } from '../../types-and-interfaces/config/state-config';
import { routerMiddleware } from '../router-middleware/router.middleware';
import { routerActionMap } from '../router.action-map';
import { routerMixin } from '../router.mixin';
import { initiateTitleMiddleware } from '../title-middleware/initiate-title-middleware';
import { isDictOfType } from '../type-guards/is-dict-of-type';
import { isPathStateDescriptor } from '../type-guards/is-path-state-descriptor';
import { isTitleStateDescriptor } from '../type-guards/is-title-state-descriptor';
import { initiateUrlMiddleware } from '../url-middleware/initiate-url-middleware';
import { createInitialAction } from './create-initial-action';
import { createStateDescriptors } from './create-state-descriptors';
import { verifyStateDescriptors } from './verify-state-descriptors';

export function initiateRouter(config: StateConfig[]): { middleware: Middleware } {
  const descriptors: StateDescriptor[] = createStateDescriptors(config);
  verifyStateDescriptors(descriptors);
  let result: any = {};
  let actions: Observable<Action> = createInitialAction(descriptors);

  const dict: Dict<StateDescriptor> = arrayToDict('name', descriptors);
  if (isDictOfType(dict, isPathStateDescriptor)) {
    const urlResult = initiateUrlMiddleware(dict);
    result.urlMiddleware = urlResult.middleware;
    actions = urlResult.actions;
    result.link = urlResult.link;
    result.linkActive = urlResult.linkActive;
  }
  if (isDictOfType(dict, isTitleStateDescriptor)) {
    result.titleMiddleware = initiateTitleMiddleware(dict);
  }
  result.middleware = partial(routerMiddleware, dict);
  result.mixin = partial(routerMixin as any, actions);
  result.actionMap = routerActionMap;

  return result;
}
