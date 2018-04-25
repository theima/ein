import { Mixin } from '../types-and-interfaces/mixin';
import { Middleware } from '../types-and-interfaces/middleware';
import { Middlewares } from '../types-and-interfaces/middlewares';
import { Node } from '../types-and-interfaces/node';
import { NodeFactory } from '../node.factory';
import { Handlers } from '../types-and-interfaces/handlers';
import { Executor } from '../types-and-interfaces/executor';
export function makeCreate(mixins: Array<Mixin<any, any>>, middlewares: Array<Middleware | Middlewares>): <T>(executorOrHandlers: Handlers<T> | Executor<T>, initial: T | null) => Node<T> {
    return <T>(executorOrHandlers: Handlers<T> | Executor<T>, initial: T | null) => {
      const factory: NodeFactory = new NodeFactory(mixins, middlewares);
      return factory.createNode(initial, executorOrHandlers);
  };
}
