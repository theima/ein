import { NodeConstructor } from '../types-and-interfaces/node-constructor';
import { NodeBehaviorSubject } from '../node-behavior-subject';
import { composeMiddleware } from './compose-middleware';
import { composeTriggerMiddleware } from './compose-trigger-middleware';
import { Middleware } from '../types-and-interfaces/middleware';
import { TriggerMiddleWare } from '../types-and-interfaces/trigger-middleware';

export function middlewareMixin<T, NBase extends NodeConstructor<NodeBehaviorSubject<T>>>(middleware: Middleware[], triggerMiddleware: TriggerMiddleWare[], node: NBase): NBase {
  return class extends node {
    constructor(...rest: any[]) {
      super(...rest);
      if (middleware.length > 0) {
        this.actionMap = composeMiddleware(this, this.actionMap, middleware);
      }
      if (triggerMiddleware.length > 0) {
        this.triggeredActionMap = composeTriggerMiddleware(this.triggeredActionMap, triggerMiddleware);
      }
    }
  };
}
