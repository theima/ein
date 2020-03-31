import { Observable } from 'rxjs';
import { Action, arrayToDict, Dict, Middleware } from '../../../core';
import { partial } from '../../../core/functions/partial';
import { TransitionAction } from '../../types-and-interfaces/actions/transition.action';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { RuleConfig } from '../../types-and-interfaces/config/rule.config';
import { StateConfig } from '../../types-and-interfaces/config/state.config';
import { routerMiddleware } from '../router-middleware/router.middleware';
import { routerActionMap } from '../router.action-map';
import { routerMixin } from '../router.mixin';
import { initiateTitleMiddleware } from '../title-middleware/initiate-title-middleware';
import { isPathConfig } from '../type-guards/is-path-config';
import { isPathConfigs } from '../type-guards/is-path-configs';
import { isTitleConfig } from '../type-guards/is-title-config';
import { isTitleConfigs } from '../type-guards/is-title-configs';
import { initiateUrlMiddleware } from '../url-middleware/initiate-url-middleware';
import { createInitialAction } from './create-initial-action';
import { createStateDescriptors } from './create-state-descriptors';

export function createStates(config: Array<RuleConfig | StateConfig>): { middleware: Middleware } {
  const stateConfig: StateDescriptor[] = createStateDescriptors(config);
  if (!isPathConfigs(stateConfig) && stateConfig.some((c) => isPathConfig(c))) {
    const missing = stateConfig.filter((s) => !(s as any).path).map((s) => s.name);
    throw new Error(`One or more states is missing a path. ${missing.join(' ')}`);
  }
  if (!isTitleConfigs(stateConfig) && stateConfig.some((c) => isTitleConfig(c))) {
    const missing = stateConfig.filter((s) => !(s as any).title).map((s) => s.name);
    throw new Error(`One or more states is missing a title.${missing.join(' ')}`);
  }
  let result: any = {};
  let actions: Observable<Action> = createInitialAction(stateConfig);
  const stateDescriptors: Dict<StateDescriptor> = arrayToDict('name', stateConfig);
  if (isPathConfigs(stateConfig)) {
    const urlResult = initiateUrlMiddleware(stateDescriptors as any);
    result.urlMiddleware = urlResult.middleware;
    actions = urlResult.actions;
    result.link = urlResult.link;
    result.linkActive = urlResult.linkActive;
  }
  if (isTitleConfigs(stateConfig)) {
    result.titleMiddleware = initiateTitleMiddleware(stateDescriptors as any);
  }
  result.middleware = partial(routerMiddleware, stateDescriptors);
  result.mixin = partial(routerMixin as any, actions);
  result.actionMap = routerActionMap;

  return result;
}
