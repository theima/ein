import { Middleware } from '../../types-and-interfaces/middleware';
import { Middlewares } from '../../types-and-interfaces/middlewares';

export function isMiddlewares<T>(m: Middleware | Middlewares<T>): m is Middlewares<T> {
  return typeof m === 'object';
}
