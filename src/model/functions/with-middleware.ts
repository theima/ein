import { Middleware } from '../types-and-interfaces/middleware';
import { Middlewares } from '../types-and-interfaces/middlewares';
import { Node } from '../types-and-interfaces/node';
import { makeWithMiddleware } from './make-with-middleware';
import { Handlers } from '../types-and-interfaces/handlers';
import { Executor } from '../types-and-interfaces/executor';
export const withMiddleware: <T>(...middleware: Array<Middleware | Middlewares>) => {
  create: (executorOrHandlers: Handlers<T> | Executor<T>, initial: T | null) => Node<T>
} = makeWithMiddleware([]);
