
import { StateAction } from './types-and-interfaces/state-action';
import { Observable } from 'rxjs/Observable';
import { Action, Executor, Handlers, NodeConstructor, NodeSubject, Translator } from '../model';

export function createRouterMixin(actions: Observable<Action>) {
  let applied: boolean = false;
  return function <T, NBase extends NodeConstructor<NodeSubject<T>>>(node: NBase): NBase {
    return class RouterNode extends node {
      public navigateHandler: (a: Action) => Action;

      constructor(...args: any[]) {
        super(...args);
        this.navigateHandler = (a: Action) => {
          return this.next({
            ...a,
            prepared: true
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
        if (a.type === StateAction.Transition && !a.prepared) {
          return this.navigateHandler(a);
        }
        return super.next(a);
      }

      public createChild<U>(executorOrHandlers: Handlers<U> | Executor<U>,
                            translatorOrProperty: Translator<T, U> | string,
                            ...properties: string[]): NodeSubject<U> {
        let child = super.createChild(executorOrHandlers, translatorOrProperty, ...properties);
        (child as any).navigateHandler = this.navigateHandler;
        return child;
      }
    };
  };
}
