import { Middleware } from './middleware';
import { UpdateMiddleWare } from './trigger-middleware';

export interface Middlewares<T> {
  next: Middleware;
  update: UpdateMiddleWare<T>;
}
