import { Middleware } from './types-and-interfaces/middleware';
import { TriggerMiddleWare } from './types-and-interfaces/trigger-middleware';
import { Middlewares } from './types-and-interfaces/middlewares';
import { EmceSubject } from './emce-subject';
import { EmceConstructor } from './types-and-interfaces/emce-constructor';
import { compose } from './functions/compose';
import { Mixin } from './types-and-interfaces/mixin';
import { createMiddlewareMixin } from './functions/middleware-mixin';
import { Handlers } from './types-and-interfaces/handlers';
import { Executor } from './types-and-interfaces/executor';

export class EmceFactory {
  private emceConstructor: EmceConstructor<EmceSubject<any>>;

  constructor(mixins: Array<Mixin<any, any>>, middlewares: Array<Middleware | Middlewares>) {
    const nextMiddleware: Middleware[] = [];
    const triggerMiddleWare: TriggerMiddleWare[] = [];
    middlewares.forEach((middleware: Middleware | Middlewares) => {
      if (typeof middleware === 'function') {
        nextMiddleware.push(middleware);
      } else {
        if (middleware.next) {
          nextMiddleware.push(middleware.next);
        }
        if (middleware.trigger) {
          triggerMiddleWare.push(middleware.trigger);
        }
      }
    });
    if (middlewares.length > 0) {
      mixins = mixins.concat([createMiddlewareMixin(nextMiddleware, triggerMiddleWare)]);
    }
    this.emceConstructor = EmceSubject;
    if (mixins.length > 0) {
      this.emceConstructor = compose(EmceSubject, ...mixins);
    }
  }

  public createEmce<T>(initial: T | null,
                       executorOrHandlers: Handlers<T>| Executor<T>): EmceSubject<T> {
    if (!initial) {
      initial = null;
    }
    if (typeof executorOrHandlers === 'function') {
      executorOrHandlers = {executor: executorOrHandlers};
    }
    const c: any = this.emceConstructor;
    return new c(initial, executorOrHandlers, this);
  }
}
