import { Observable } from 'rxjs';
import { partial } from '../functions/partial';
import { chainMixins } from './functions/chain-mixins';
import { isMiddlewares } from './functions/type-guards/is-middlewares';
import { middlewareMixin } from './mixins/middleware.mixin';
import { NodeBehaviorSubject } from './node-behavior-subject';
import { Middleware } from './types-and-interfaces/middleware';
import { Middlewares } from './types-and-interfaces/middlewares';
import { Mixin } from './types-and-interfaces/mixin';
import { NodeConstructor } from './types-and-interfaces/node-constructor';
import { Reducer } from './types-and-interfaces/reducer';
import { TriggerMiddleWare } from './types-and-interfaces/trigger-middleware';

export class NodeFactory {
  private nodeConstructor: NodeConstructor<NodeBehaviorSubject<any>>;

  constructor(
    mixins: Array<Mixin<any, any>>,
    middlewares: Array<Middleware | Middlewares<any>>
  ) {
    const nextMiddleware: Middleware[] = [];
    const triggerMiddleWare: Array<TriggerMiddleWare<any>> = [];
    middlewares.forEach((middleware: Middleware | Middlewares<any>) => {
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
      const mixin: Mixin<any, any> = partial(
        middlewareMixin,
        nextMiddleware,
        triggerMiddleWare
      );
      mixins = mixins.concat([mixin]);
    }
    this.nodeConstructor = NodeBehaviorSubject;
    if (mixins.length > 0) {
      this.nodeConstructor = chainMixins(NodeBehaviorSubject, ...mixins);
    }
  }

  public createNode<T>(
    initial: T,
    reducer: Reducer<T>,
    stream?: Observable<T>
  ): NodeBehaviorSubject<T> {
    const c = this.nodeConstructor;
    return new c(initial, reducer, this, stream) as NodeBehaviorSubject<T>;
  }
}
