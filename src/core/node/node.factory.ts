import { Observable } from 'rxjs';
import { partial } from '../functions/partial';
import { chainMixins } from './functions/chain-mixins';
import { isMiddlewares } from './functions/type-guards/is-middlewares';
import { middlewareMixin } from './mixins/middleware.mixin';
import { NodeBehaviorSubject } from './node-behavior-subject';
import { ActionMap } from './types-and-interfaces/action-map';
import { Middleware } from './types-and-interfaces/middleware';
import { Middlewares } from './types-and-interfaces/middlewares';
import { Mixin } from './types-and-interfaces/mixin';
import { NodeConstructor } from './types-and-interfaces/node-constructor';
import { TriggerMiddleWare } from './types-and-interfaces/trigger-middleware';

export class NodeFactory {
  private nodeConstructor: NodeConstructor<NodeBehaviorSubject<any>>;

  constructor(mixins: Array<Mixin<any, any>>, middlewares: Array<Middleware | Middlewares>) {
    const nextMiddleware: Middleware[] = [];
    const triggerMiddleWare: TriggerMiddleWare[] = [];
    middlewares.forEach((middleware: Middleware | Middlewares) => {
      if (isMiddlewares(middleware)) {
        if (middleware.next) {
          nextMiddleware.push(middleware.next);
        }
        if (middleware.trigger) {
          triggerMiddleWare.push(middleware.trigger);
        }
      } else {
        nextMiddleware.push(middleware);
      }
    });
    if (middlewares.length > 0) {
      const mixin: Mixin<any, any> = partial(middlewareMixin, nextMiddleware, triggerMiddleWare);
      mixins = mixins.concat([mixin]);
    }
    this.nodeConstructor = NodeBehaviorSubject;
    if (mixins.length > 0) {
      this.nodeConstructor = chainMixins(NodeBehaviorSubject, ...mixins);
    }
  }

  public createNode<T>(initial:T,
                       actionMap: ActionMap<T>,
                       stream?: Observable<T>): NodeBehaviorSubject<T> {
    const c: any = this.nodeConstructor;
    return new c(initial, actionMap, this, stream);
  }
}