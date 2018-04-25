import { Middleware } from './middleware';
import { Middlewares } from './middlewares';
import { Node } from './node';
import { Handlers } from './handlers';
import { Executor } from './executor';
export interface AppliedMixins<T, M extends Node<T>> {
  create: (executorOrHandlers: Handlers<T> | Executor<T>, initial: T | null) => M;
  withMiddleware: (...middleware: Array<Middleware | Middlewares>) => {
    create: (executorOrHandlers: Handlers<T> | Executor<T>, initial: T | null) => M
  };
}
