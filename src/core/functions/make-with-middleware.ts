import { Mixin } from '../types-and-interfaces/mixin';
import { Middleware } from '../types-and-interfaces/middleware';
import { Middlewares } from '../types-and-interfaces/middlewares';
import { Node } from '../types-and-interfaces/node';
import { NodeConstructor } from '../types-and-interfaces/node-constructor';
import { makeCreate } from './make-create';
import { ActionMaps } from '../types-and-interfaces/action-maps';
import { ActionMap } from '..';

export function makeWithMiddleware<T, N extends Node<T>, NBase extends NodeConstructor<N>>(mixins: Array<Mixin<N, NBase>>) {
  return <T>(...middleware: Array<Middleware | Middlewares>): {
    create: (actionMapOrActionMaps: ActionMap<T> | ActionMaps<T>, initial: T) => Node<T>
  } => {
    return {
      create: makeCreate(mixins, middleware)
    };
  };
}
