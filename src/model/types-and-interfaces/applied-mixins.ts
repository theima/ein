import { Middleware } from './middleware';
import { Middlewares } from './middlewares';
import { Node } from './node';
import { ActionMaps } from './action-maps';
import { ActionMap } from './action-map';
export interface AppliedMixins<T, M extends Node<T>> {
  create: (actionMapOrActionMaps: ActionMaps<T> | ActionMap<T>, initial: T) => M;
  withMiddleware: (...middleware: Array<Middleware | Middlewares>) => {
    create: (actionMapOrActionMaps: ActionMaps<T> | ActionMap<T>, initial: T) => M
  };
}
