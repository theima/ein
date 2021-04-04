import { Middleware } from './middleware';
import { UpdateMiddleWare } from './update-middleware';

export interface Middlewares<T> {
  next: Middleware;
  update: UpdateMiddleWare<T>;
}
