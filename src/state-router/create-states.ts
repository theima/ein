import { routerMiddleware } from './router-middleware';
import { StateConfig } from './types-and-interfaces/state.config';
import { PathConfig } from './types-and-interfaces/path.config';
import { urlMiddleware } from './url-middleware';
import { pushUrl } from './functions/push-url';
import { RuleConfig } from './types-and-interfaces/rule.config';
import { StateDescriptor } from './types-and-interfaces/state.descriptor';
import { TitleConfig } from './types-and-interfaces/title.config';
import { titleMiddleware } from './title-middleware';
import { setTitle } from './functions/set-title';
import { routerActionMap } from './router-action-map';
import { routerMixin } from './router-mixin';
import { createStateDescriptors } from './functions/create-state-descriptors';
import { Observable, from } from 'rxjs';
import { popActions } from './functions/pop-actions';
import { State } from './types-and-interfaces/state';
import { TransitionAction } from './types-and-interfaces/transition.action';
import { StateAction } from './types-and-interfaces/state-action';
import { Action, arrayToDict, Dict, Middleware } from '../core';
import { partial } from '../core/functions/partial';

export function createStates(config: Array<RuleConfig | StateConfig>): { middleware: Middleware };
export function createStates(config: Array<RuleConfig | StateConfig & PathConfig>): any;
export function createStates(config: Array<RuleConfig | StateConfig & TitleConfig>): any;
export function createStates(config: Array<RuleConfig | StateConfig & PathConfig & TitleConfig>): any;
export function createStates(config: Array<RuleConfig | StateConfig>): { middleware: Middleware } {
  const stateConfig: StateDescriptor[] = createStateDescriptors(config);
  let result: any = {};
  let actions: Observable<Action>;
  const states: Dict<StateDescriptor> = arrayToDict('name', stateConfig);
  const pathConfig: PathConfig[] = stateConfig as any;
  if (pathConfig.length > 0 && pathConfig[0].path !== undefined) {
    const paths: Dict<PathConfig> = arrayToDict('name', pathConfig);
    result.urlMiddleware = partial(urlMiddleware, paths, pushUrl);
    actions = popActions(pathConfig);
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
  const titleConfig: TitleConfig[] = stateConfig as any;
  if (titleConfig.length > 0 && titleConfig[0].title !== undefined) {
    const titles: Dict<TitleConfig> = arrayToDict('name', titleConfig);
    result.titleMiddleware = partial(titleMiddleware, titles, setTitle(document));
  }
  result.middleware = partial(routerMiddleware, states);
  result.mixin = partial(routerMixin as any, actions);
  result.actionMap = routerActionMap;
  return result;
}
