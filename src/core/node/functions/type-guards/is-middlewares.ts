import { Middlewares } from '../../types-and-interfaces/middlewares';
import { Middleware } from '../../types-and-interfaces/middleware';

export function isMiddlewares(m: Middleware | Middlewares): m is Middlewares {
  return typeof m === 'object';
}
