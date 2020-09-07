import { Observable } from 'rxjs';
import { Action, arrayToDict, Dict } from '../../../core';
import { partial } from '../../../core/functions/partial';
import { Extender } from '../../../view';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { StateConfig } from '../../types-and-interfaces/config/state-config';
import { Extend } from '../../types-and-interfaces/extend';
import { routerMiddleware } from '../router-middleware/router.middleware';
import { initiateTitleMiddleware } from '../title-middleware/initiate-title-middleware';
import { isDictOfType } from '../type-guards/is-dict-of-type';
import { isPathStateDescriptor } from '../type-guards/is-path-state-descriptor';
import { isTitleStateDescriptor } from '../type-guards/is-title-state-descriptor';
import { initiateUrlMiddleware } from '../url-middleware/initiate-url-middleware';
import { createInitialAction } from './create-initial-action';
import { createStateDescriptors } from './create-state-descriptors';
import { verifyStateDescriptors } from './verify-state-descriptors';

export function initiateRouter(config: StateConfig[]): Extend {
  const descriptors: StateDescriptor[] = createStateDescriptors(config);
  verifyStateDescriptors(descriptors);
  let actions: Observable<Action> = createInitialAction(descriptors);
  const dict: Dict<StateDescriptor> = arrayToDict('name', descriptors);
  let middlewares = [partial(routerMiddleware, dict)];
  let extenders: Extender[] = [];
  if (isDictOfType(dict, isPathStateDescriptor)) {
    const urlResult = initiateUrlMiddleware(dict);
    middlewares = middlewares.concat(urlResult.middlewares);
    actions = urlResult.actions;
    extenders = extenders.concat(urlResult.extenders);
  }
  if (isDictOfType(dict, isTitleStateDescriptor)) {
    const titleResult = initiateTitleMiddleware(dict);
    middlewares.push(titleResult);
  }
  return {
    middlewares,
    extenders,
    actions
  };
}
