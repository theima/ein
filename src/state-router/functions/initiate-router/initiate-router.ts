import { Observable } from 'rxjs';
import { Action, arrayToDict, Dict, Middleware } from '../../../core';
import { partial } from '../../../core/functions/partial';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { StateConfig } from '../../types-and-interfaces/config/state.config';
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

export function initiateRouter(config: StateConfig[]): { middleware: Middleware } {
  const stateConfig: StateDescriptor[] = createStateDescriptors(config);
  let result: any = {};
  let actions: Observable<Action> = createInitialAction(stateConfig);
  const stateDescriptors: Dict<StateDescriptor> = arrayToDict('name', stateConfig);

  if (isDictOfType(stateDescriptors, isPathStateDescriptor)) {
    const urlResult = initiateUrlMiddleware(stateDescriptors);
    result.urlMiddleware = urlResult.middleware;
    actions = urlResult.actions;
    result.link = urlResult.link;
    result.linkActive = urlResult.linkActive;
  }
  if (isDictOfType(stateDescriptors, isTitleStateDescriptor)) {
    result.titleMiddleware = initiateTitleMiddleware(stateDescriptors);
  }
  result.middleware = partial(routerMiddleware, stateDescriptors);
  result.mixin = partial(routerMixin as any, actions);
  result.actionMap = routerActionMap;

  return result;
}
