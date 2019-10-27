import { ActionMap } from '../types-and-interfaces/action-map';
import { ActionMaps } from '../types-and-interfaces/action-maps';
import { Middleware } from '../types-and-interfaces/middleware';
import { Middlewares } from '../types-and-interfaces/middlewares';
import { Node } from '../types-and-interfaces/node';
import { makeWithMiddleware } from './make-with-middleware';
export const withMiddleware: <T>(...middleware: Array<Middleware | Middlewares>) => {
  create: (actionMapOrActionMaps: ActionMaps<T> | ActionMap<T>, initial: T) => Node<T>
} = makeWithMiddleware([]);
