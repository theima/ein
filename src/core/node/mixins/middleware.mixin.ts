import { chainMiddleware } from '../functions/chain-middleware';
import { NodeBehaviorSubject } from '../node-behavior-subject';
import { Middleware } from '../types-and-interfaces/middleware';
import { NodeConstructor } from '../types-and-interfaces/node-constructor';
import { UpdateMiddleWare } from '../types-and-interfaces/trigger-middleware';

export function middlewareMixin<
  T,
  NBase extends NodeConstructor<NodeBehaviorSubject<T>>
>(
  middleware: Middleware[],
  triggerMiddleware: Array<UpdateMiddleWare<T>>,
  node: NBase
): NBase {
  return class extends node {
    constructor(...rest: any[]) {
      super(...rest);
      if (middleware.length > 0) {
        this.actionMap = chainMiddleware(
          this as any,
          this.actionMap,
          middleware
        );
      }
      if (triggerMiddleware.length > 0) {
        this.updateMap = chainMiddleware(
          this as any,
          this.updateMap,
          triggerMiddleware
        );
      }
    }
  };
}
