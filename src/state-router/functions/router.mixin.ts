import { Observable } from 'rxjs';
import { Action, ActionMap, ActionMaps, NodeBehaviorSubject, NodeConstructor, Translator } from '../../core';
import { TransitionAction } from '../types-and-interfaces/actions/transition.action';
import { isTransitionAction } from './router-middleware/type-guards/is-transition-action';

export function routerMixin<T, NBase extends NodeConstructor<NodeBehaviorSubject<T>>>(actions: Observable<Action>, node: NBase): NBase {
  let applied: boolean = false;
  return class RouterNode extends node {
    public navigateHandler: (a: TransitionAction) => Action;

    constructor(...args: any[]) {
      super(...args);
      this.navigateHandler = (a: TransitionAction) => {
        return this.next(a);
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
      let child: RouterNode = super.createChild(actionMapOrActionMaps, translatorOrProperty, ...properties) as any;
      child.navigateHandler = this.navigateHandler;
      return child as any;
    }
  };
}
