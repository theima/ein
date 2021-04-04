import { NodeFactory } from '../node.factory';
import { Middleware } from '../types-and-interfaces/middleware';
import { Middlewares } from '../types-and-interfaces/middlewares';
import { Mixin } from '../types-and-interfaces/mixin';
import { Node } from '../types-and-interfaces/node';
import { Reducer } from '../types-and-interfaces/reducer';

export function create<T>(
  initial: T,
  reducer: Reducer<T>,
  mixins: Array<Mixin<any, any>> = [],
  middlewares: Array<Middleware | Middlewares<T>> = []
): Node<T> {
  const factory: NodeFactory<T> = new NodeFactory(mixins, middlewares);
  return factory.createNode(initial, reducer);
}
