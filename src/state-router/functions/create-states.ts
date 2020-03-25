import { from, Observable } from 'rxjs';
import { Action, arrayToDict, Dict, Middleware } from '../../core';
import { partial } from '../../core/functions/partial';
import { StateAction } from '../types-and-interfaces/actions/state-action';
import { TransitionAction } from '../types-and-interfaces/actions/transition.action';
import { StateDescriptor } from '../types-and-interfaces/config/descriptor/state.descriptor';
import { PathConfig } from '../types-and-interfaces/config/path.config';
import { RuleConfig } from '../types-and-interfaces/config/rule.config';
import { StateConfig } from '../types-and-interfaces/config/state.config';
import { TitleConfig } from '../types-and-interfaces/config/title.config';
import { State } from '../types-and-interfaces/state/state';
import { createStateDescriptors } from './create-state-descriptors';
import { routerMiddleware } from './router-middleware/router.middleware';
import { routerActionMap } from './router.action-map';
import { routerMixin } from './router.mixin';
import { createSetTitle } from './title-middleware/create-set-title';
import { titleMiddleware } from './title-middleware/title.middleware';
import { isPathConfigs } from './type-guards/is-path-configs';
import { isTitleConfigs } from './type-guards/is-title-configs';
import { initiateUrlMiddleware } from './url-middleware/initiate-url-middleware';

export function createStates(config: Array<RuleConfig | StateConfig>): { middleware: Middleware };
export function createStates(config: Array<RuleConfig | StateConfig & PathConfig>): any;
export function createStates(config: Array<RuleConfig | StateConfig & TitleConfig>): any;
export function createStates(config: Array<RuleConfig | StateConfig & PathConfig & TitleConfig>): any;
export function createStates(config: Array<RuleConfig | StateConfig>): { middleware: Middleware } {
  const stateConfig: StateDescriptor[] = createStateDescriptors(config);
  let result: any = {};
  let actions: Observable<Action>;
  const states: Dict<StateDescriptor> = arrayToDict('name', stateConfig);
  const hasStateConfigs = stateConfig.length > 0;
  if (hasStateConfigs) {
    if (isPathConfigs(stateConfig)) {
      const urlResult = initiateUrlMiddleware(stateConfig);
      result.urlMiddleware = urlResult.middleware;
      actions = urlResult.actions;
      result.link = urlResult.link;
      result.linkActive = urlResult.linkActive;
    } else {
      const defaultState: State = {
        name: stateConfig[0].name,
        params: {}
      };
      const initialAction: TransitionAction = {
        type: StateAction.Transition,
        ...defaultState
      };
      actions = from([initialAction]);
    }
    if (isTitleConfigs(stateConfig)) {
      const titles: Dict<TitleConfig> = arrayToDict('name', stateConfig);
      result.titleMiddleware = partial(titleMiddleware, titles, createSetTitle(document));
    }
  } else {
    actions = from([]);
  }

  result.middleware = partial(routerMiddleware, states);
  result.mixin = partial(routerMixin as any, actions);
  result.actionMap = routerActionMap;

  return result;
}
