import { EmceConstructor } from '../types-and-interfaces/emce-constructor';
import { EmceSubject } from '../emce-subject';
import { composeMiddleware } from './compose-middleware';
import { composeTriggerMiddleware } from './compose-trigger-middleware';
import { Middleware } from '../types-and-interfaces/middleware';
import { TriggerMiddleWare } from '../types-and-interfaces/trigger-middleware';
export function createMiddlewareMixin(middleware: Middleware[], triggerMiddleware: TriggerMiddleWare[]) {
  return function middlewareMixin<EBase extends EmceConstructor<EmceSubject<any>>>(emce: EBase): EBase {
    return class extends emce {
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
  };
}
