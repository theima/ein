import { createRouterMiddleware } from './create-router-middleware';
import { StateConfig } from './types-and-interfaces/state.config';
import { Dict } from './types-and-interfaces/dict';
import { PathConfig } from './types-and-interfaces/path.config';
import { arrayToDict } from './functions/array-to-dict';
import { createUrlMiddleware } from './create-url-middleware';
import { pushUrl } from './functions/push-url';
import { RuleConfig } from './types-and-interfaces/rule.config';
import { StateDescriptor } from './types-and-interfaces/state.descriptor';
import { TitleConfig } from './types-and-interfaces/title.config';
import { createTitleMiddleware } from './create-title-middleware';
import { setTitle } from './functions/set-title';
import { executor } from './executor';
import { createRouterMixin } from './create-router-mixin';
import { createStateDescriptors } from './functions/create-state-descriptors';
import { Observable } from 'rxjs/Observable';
import { popActions } from './functions/pop-actions';
import { State } from './types-and-interfaces/state';
import 'rxjs/add/observable/from';
import { TransitionAction } from './types-and-interfaces/transition.action';
import { StateAction } from './types-and-interfaces/state-action';
import { Action, Middleware } from '../model';

export function createStates(config: Array<RuleConfig | StateConfig>): { middleware: Middleware };
export function createStates(config: Array<RuleConfig | StateConfig & PathConfig>): any;
export function createStates(config: Array<RuleConfig | StateConfig & TitleConfig>): any;
export function createStates(config: Array<RuleConfig | StateConfig & PathConfig & TitleConfig>): any;
export function createStates(config: Array<RuleConfig | StateConfig>): { middleware: Middleware } {
  const stateConfig: StateDescriptor[] = createStateDescriptors(config);
  let result: any = {};
  let actions: Observable<Action>;
  const states: Dict<StateDescriptor> = arrayToDict(stateConfig);
  const pathConfig: PathConfig[] = stateConfig as any;
  if (pathConfig.length > 0 && pathConfig[0].path !== undefined) {
    const paths: Dict<PathConfig> = arrayToDict(pathConfig);
    result.urlMiddleware = createUrlMiddleware(paths, pushUrl);
    actions = popActions(pathConfig)();
  } else {
    const defaultState: State = {
      name: stateConfig[0].name,
      params: {}
    };
    const initialAction: TransitionAction = {
      type: StateAction.Transition,
      ...defaultState
    };
    actions = Observable.from([initialAction]);
  }
  const titleConfig: TitleConfig[] = stateConfig as any;
  if (titleConfig.length > 0 && titleConfig[0].title !== undefined) {
    const titles: Dict<TitleConfig> = arrayToDict(titleConfig);
    result.titleMiddleware = createTitleMiddleware(titles, setTitle(document));
  }
  result.middleware = createRouterMiddleware(states);
  result.mixin = createRouterMixin(actions);
  result.executor = executor;
  return result;
}
