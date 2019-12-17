import { NodeBehaviorSubject } from '../node-behavior-subject';
import { Middleware } from '../types-and-interfaces/middleware';
import { NodeConstructor } from '../types-and-interfaces/node-constructor';
import { TriggerMiddleWare } from '../types-and-interfaces/trigger-middleware';
import { composeMiddleware } from './compose-middleware';
import { composeTriggerMiddleware } from './compose-trigger-middleware';

export function middlewareMixin<T, NBase extends NodeConstructor<NodeBehaviorSubject<T>>>(middleware: Middleware[], triggerMiddleware: TriggerMiddleWare[], node: NBase): NBase {
  return class extends node {
    constructor(...rest: any[]) {
      super(...rest);
      if (middleware.length > 0) {
        this.mapAction = composeMiddleware(this, this.mapAction, middleware);
      }
      if (triggerMiddleware.length > 0) {
        this.mapTriggeredAction = composeTriggerMiddleware(this.mapTriggeredAction, triggerMiddleware);
      }
    }
  };
}