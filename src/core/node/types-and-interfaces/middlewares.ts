import { Middleware } from './middleware';
import { TriggerMiddleWare } from './trigger-middleware';

export interface Middlewares<T> {
  next: Middleware;
  trigger: TriggerMiddleWare<T>;
}
