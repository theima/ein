import { Action, NodeBehaviorSubject, NodeConstructor, Reducer, Translator, Trigger } from '../../core';
import { TransitionAction } from '../types-and-interfaces/actions/transition.action';
import { isTransitionAction } from './router-middleware/type-guards/is-transition-action';

export function routerMixin<T, NBase extends NodeConstructor<NodeBehaviorSubject<T>>>(node: NBase): NBase {
  return class RouterNode extends node {
    public navigateHandler: (a: TransitionAction) => Action;

    constructor(...args: any[]) {
      super(...args);
      this.navigateHandler = (a: TransitionAction) => {
        return super.next(a);
      };
    }

    public next(a: Action): Action {
      if (isTransitionAction(a)) {
        return this.navigateHandler(a);
      }
      return super.next(a);
    }

    public createChild<U>(
      reducer: Reducer<U>,
      b: Translator<T, U> | string | Trigger<T, U>,
      c?: Translator<T, U> | string,
      ...properties: string[]
    ): NodeBehaviorSubject<U> {
      const child: RouterNode = (super.createChild(reducer, b, c, ...properties) as unknown) as RouterNode;
      child.navigateHandler = this.navigateHandler;
      return (child as unknown) as NodeBehaviorSubject<U>;
    }
  };
}
