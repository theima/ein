import { Observable } from 'rxjs';
import { Action, ActionMap, ActionMaps, NodeBehaviorSubject, NodeConstructor, Translator } from '../../core';
import { StateAction } from '../types-and-interfaces/state-action';
import { isTransitionAction } from './router-middleware/type-guards/is-transition-action';

export function routerMixin<T, NBase extends NodeConstructor<NodeBehaviorSubject<T>>>(actions: Observable<Action>, node: NBase): NBase {
  let applied: boolean = false;
  return class RouterNode extends node {
    public navigateHandler: (a: Action) => Action;

    constructor(...args: any[]) {
      super(...args);
      this.navigateHandler = (a: Action) => {
        return this.next({
          ...a,
          type: StateAction.InitiateTransition
        });
      };
      if (!applied) {
        applied = true;
        actions.subscribe((action: Action) => {
          this.next(action);
        });
      }
    }

    public next(a: Action): Action {
      if (isTransitionAction(a)) {
        return this.navigateHandler(a);
      }
      return super.next(a);
    }

    public createChild<U>(actionMapOrActionMaps: ActionMaps<U> | ActionMap<U>,
                          translatorOrProperty: Translator<T, U> | string,
                          ...properties: string[]): NodeBehaviorSubject<U> {
      let child = super.createChild(actionMapOrActionMaps, translatorOrProperty, ...properties);
      (child as any).navigateHandler = this.navigateHandler;
      return child;
    }
  };
}
