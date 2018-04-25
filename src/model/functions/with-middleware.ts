import { Middleware } from '../types-and-interfaces/middleware';
import { Middlewares } from '../types-and-interfaces/middlewares';
import { Emce } from '../types-and-interfaces/emce';
import { makeWithMiddleware } from './make-with-middleware';
import { Handlers } from '../types-and-interfaces/handlers';
import { Executor } from '../types-and-interfaces/executor';
export const withMiddleware: <T>(...middleware: Array<Middleware | Middlewares>) => {
  create: (executorOrHandlers: Handlers<T> | Executor<T>, initial: T | null) => Emce<T>
} = makeWithMiddleware([]);
