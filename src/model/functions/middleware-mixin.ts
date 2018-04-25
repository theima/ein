import { NodeConstructor } from '../types-and-interfaces/node-constructor';
import { NodeSubject } from '../node-subject';
import { composeMiddleware } from './compose-middleware';
import { composeTriggerMiddleware } from './compose-trigger-middleware';
import { Middleware } from '../types-and-interfaces/middleware';
import { TriggerMiddleWare } from '../types-and-interfaces/trigger-middleware';

export function middlewareMixin<T, NBase extends NodeConstructor<NodeSubject<T>>>(middleware: Middleware[], triggerMiddleware: TriggerMiddleWare[], node: NBase): NBase {
  return class extends node {
    constructor(...rest: any[]) {
      super(...rest);
      if (middleware.length > 0) {
        this.execute = composeMiddleware(this, this.execute, middleware);
      }
      if (triggerMiddleware.length > 0) {
        this.executeForTriggered = composeTriggerMiddleware(this.executeForTriggered, triggerMiddleware);
      }
    }
  };
}
