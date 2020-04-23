import { NodeFactory } from '../node.factory';
import { ActionMap } from '../types-and-interfaces/action-map';
import { ActionMaps } from '../types-and-interfaces/action-maps';
import { Middleware } from '../types-and-interfaces/middleware';
import { Middlewares } from '../types-and-interfaces/middlewares';
import { Mixin } from '../types-and-interfaces/mixin';
import { Node } from '../types-and-interfaces/node';

export function create<T>(actionMapOrActionMaps: ActionMaps<T> | ActionMap<T>,
                          initial: T,
                          mixins: Array<Mixin<any, any>> = [],
                          middlewares: Array<Middleware | Middlewares> = []): Node<T> {
 const factory: NodeFactory = new NodeFactory(mixins, middlewares);
 return factory.createNode(initial, actionMapOrActionMaps);
}
