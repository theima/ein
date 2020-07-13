import { Middleware } from '../../types-and-interfaces/middleware';
import { Middlewares } from '../../types-and-interfaces/middlewares';

export function isMiddlewares(m: Middleware | Middlewares): m is Middlewares {
  return typeof m === 'object';
}
