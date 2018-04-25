import { Mixin } from '../types-and-interfaces/mixin';
import { Middleware } from '../types-and-interfaces/middleware';
import { Middlewares } from '../types-and-interfaces/middlewares';
import { Node } from '../types-and-interfaces/node';
import { NodeConstructor } from '../types-and-interfaces/node-constructor';
import { makeCreate } from './make-create';
import { Handlers } from '../types-and-interfaces/handlers';
import { Executor } from '..';

export function makeWithMiddleware<T, N extends Node<T>, NBase extends NodeConstructor<N>>(mixins: Array<Mixin<N, NBase>>) {
  return <T>(...middleware: Array<Middleware | Middlewares>): {
    create: (executorOrHandlers: Executor<T> | Handlers<T>, initial: T | null) => Node<T>
  } => {
    return {
      create: makeCreate(mixins, middleware)
    };
  };
}
