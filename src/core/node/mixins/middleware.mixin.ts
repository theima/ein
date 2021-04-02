import { chainMiddleware } from '../functions/chain-middleware';
import { NodeBehaviorSubject } from '../node-behavior-subject';
import { Action } from '../types-and-interfaces/action';
import { Middleware } from '../types-and-interfaces/middleware';
import { NodeConstructor } from '../types-and-interfaces/node-constructor';
import { TriggerMiddleWare } from '../types-and-interfaces/trigger-middleware';

export function middlewareMixin<
  T,
  NBase extends NodeConstructor<NodeBehaviorSubject<T>>
>(
  middleware: Middleware[],
  triggerMiddleware: TriggerMiddleWare[],
  node: NBase
): NBase {
  return class extends node {
    constructor(...rest: any[]) {
      super(...rest);
      if (middleware.length > 0) {
        this.mapAction = chainMiddleware(
          this as any,
          this.mapAction,
          middleware
        );
      }
      if (triggerMiddleware.length > 0) {
        this.mapTriggeredAction = (model: T, action?: Action) => {
          const tempWrapped = (action: Action) => {
            model = this.mapTriggeredAction(model, action)
            return action;
          }
          const tempChained = chainMiddleware(
            this as any,
            tempWrapped,
            triggerMiddleware
          );
          if (action) {
            tempChained(action);
          }
          return model;
        }
      }

    }
  }
}