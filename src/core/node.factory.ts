import { Middleware } from './types-and-interfaces/middleware';
import { TriggerMiddleWare } from './types-and-interfaces/trigger-middleware';
import { Middlewares } from './types-and-interfaces/middlewares';
import { NodeBehaviorSubject } from './node-behavior-subject';
import { NodeConstructor } from './types-and-interfaces/node-constructor';
import { compose } from './functions/compose';
import { Mixin } from './types-and-interfaces/mixin';
import { middlewareMixin } from './functions/middleware-mixin';
import { ActionMaps } from './types-and-interfaces/action-maps';
import { ActionMap } from './types-and-interfaces/action-map';
import { partial } from './functions/partial';
import { Observable } from 'rxjs';

export class NodeFactory {
  private nodeConstructor: NodeConstructor<NodeBehaviorSubject<any>>;

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
      const mixin: Mixin<any, any> = partial(middlewareMixin as any, nextMiddleware, triggerMiddleWare);
      mixins = mixins.concat([mixin]);
    }
    this.nodeConstructor = NodeBehaviorSubject;
    if (mixins.length > 0) {
      this.nodeConstructor = compose(NodeBehaviorSubject, ...mixins);
    }
  }

  public createNode<T>(initial: T | null,
                       actionMapOrActionMaps: ActionMaps<T>| ActionMap<T>,
                       stream?: Observable<T | null>): NodeBehaviorSubject<T> {
    if (!initial) {
      initial = null;
    }
    if (!actionMapOrActionMaps) {
      throw new Error('A map must be specified');
    }
    if (typeof actionMapOrActionMaps === 'function') {
      actionMapOrActionMaps = {actionMap: actionMapOrActionMaps};
    }
    const c: any = this.nodeConstructor;
    return new c(initial, actionMapOrActionMaps, this, stream);
  }
}
