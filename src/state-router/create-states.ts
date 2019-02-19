import { routerMiddleware } from './core/router-middleware';
import { StateConfig } from './core/types-and-interfaces/state.config';
import { PathConfig } from './url/types-and-interfaces/path.config';
import { urlMiddleware } from './url/url-middleware';
import { pushUrl } from './url/functions/push-url';
import { RuleConfig } from './core/types-and-interfaces/rule.config';
import { StateDescriptor } from './core/types-and-interfaces/state.descriptor';
import { TitleConfig } from './core/types-and-interfaces/title.config';
import { titleMiddleware } from './title/title-middleware';
import { setTitle } from './title/functions/set-title';
import { routerActionMap } from './core/router.action-map';
import { routerMixin } from './core/router-mixin';
import { createStateDescriptors } from './core/functions/create-state-descriptors';
import { Observable, from } from 'rxjs';
import { popActions } from './url/functions/pop-actions';
import { State } from './core/types-and-interfaces/state';
import { TransitionAction } from './core/types-and-interfaces/transition.action';
import { StateAction } from './core/types-and-interfaces/state-action';
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
