import { Middleware } from './middleware';
import { TriggerMiddleWare } from './trigger-middleware';

export interface Middlewares {
  next: Middleware;
  trigger: TriggerMiddleWare;
}
