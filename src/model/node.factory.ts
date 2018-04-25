import { Middleware } from './types-and-interfaces/middleware';
import { TriggerMiddleWare } from './types-and-interfaces/trigger-middleware';
import { Middlewares } from './types-and-interfaces/middlewares';
import { NodeSubject } from './node-subject';
import { NodeConstructor } from './types-and-interfaces/node-constructor';
import { compose } from './functions/compose';
import { Mixin } from './types-and-interfaces/mixin';
import { createMiddlewareMixin } from './functions/middleware-mixin';
import { Handlers } from './types-and-interfaces/handlers';
import { Executor } from './types-and-interfaces/executor';

export class NodeFactory {
  private nodeConstructor: NodeConstructor<NodeSubject<any>>;

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
    this.nodeConstructor = NodeSubject;
    if (mixins.length > 0) {
      this.nodeConstructor = compose(NodeSubject, ...mixins);
    }
  }

  public createNode<T>(initial: T | null,
                       executorOrHandlers: Handlers<T>| Executor<T>): NodeSubject<T> {
    if (!initial) {
      initial = null;
    }
    if (typeof executorOrHandlers === 'function') {
      executorOrHandlers = {executor: executorOrHandlers};
    }
    const c: any = this.nodeConstructor;
    return new c(initial, executorOrHandlers, this);
  }
}
