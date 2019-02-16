import { Mixin } from '../types-and-interfaces/mixin';
import { Middleware } from '../types-and-interfaces/middleware';
import { Middlewares } from '../types-and-interfaces/middlewares';
import { Node } from '../types-and-interfaces/node';
import { NodeFactory } from '../node.factory';
import { ActionMaps } from '../types-and-interfaces/action-maps';
import { ActionMap } from '../types-and-interfaces/action-map';

export function makeCreate(mixins: Array<Mixin<any, any>>, middlewares: Array<Middleware | Middlewares>): <T>(actionMapOrActionMaps: ActionMaps<T> | ActionMap<T>, initial: T) => Node<T> {
  return <T>(actionMapOrActionMaps: ActionMaps<T> | ActionMap<T>, initial: T) => {
    const factory: NodeFactory = new NodeFactory(mixins, middlewares);
    return factory.createNode(initial, actionMapOrActionMaps);
  };
}
