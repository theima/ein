import { from, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { Action, arrayToDict, Dict, Middleware } from '../../core';
import { partial } from '../../core/functions/partial';
import { ExtenderDescriptor } from '../../html-renderer';
import { linkActiveExtender } from '../extenders/link-active.extender';
import { linkExtender } from '../extenders/link.extender';
import { TransitionAction } from '../types-and-interfaces/actions/transition.action';
import { PathConfig } from '../types-and-interfaces/path.config';
import { RuleConfig } from '../types-and-interfaces/rule.config';
import { State } from '../types-and-interfaces/state';
import { StateAction } from '../types-and-interfaces/state-action';
import { StateConfig } from '../types-and-interfaces/state.config';
import { StateDescriptor } from '../types-and-interfaces/state.descriptor';
import { TitleConfig } from '../types-and-interfaces/title.config';
import { routerMiddleware } from './router-middleware/router-middleware';
import { routerMixin } from './router-mixin';
import { routerActionMap } from './router.action-map';
import { setTitle } from './title-middleware/set-title';
import { titleMiddleware } from './title-middleware/title-middleware';
import { createStateDescriptors } from './url-middleware/create-state-descriptors';
import { popActions } from './url-middleware/pop-actions';
import { pushUrl } from './url-middleware/push-url';
import { urlMiddleware } from './url-middleware/url-middleware';

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
    const stateChanges: ReplaySubject<State> = new ReplaySubject(1);
    const stateChanged = (s: State) => {
      stateChanges.next(s);
    };
    const middleware: Middleware = partial(urlMiddleware, paths, pushUrl, stateChanged);
    result.urlMiddleware = middleware;
    const linkSubject = new Subject<Action>();
    const linkActions = (a: Action) => {
      linkSubject.next(a);
    };
    actions = merge(popActions(pathConfig), linkSubject);
    const link: ExtenderDescriptor = linkExtender(pathConfig, linkActions);
    const active: ExtenderDescriptor = linkActiveExtender(pathConfig, stateChanges);
    result.link = link;
    result.linkActive = active;
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
