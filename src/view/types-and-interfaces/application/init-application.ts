import {
  create,
  Middleware,
  Middlewares,
  Mixin,
  Node,
  Reducer
} from '../../../core';
import {
  Extend,
  initiateRouter,
  routerMixin,
  StateConfig
} from '../../../state-router';
import { ComponentTemplate } from '../component/component';
import { Extender } from '../extender/extender';
import { View } from '../view';

export function initApplication<T>(
  initialValue: T,
  reducer: Reducer<T>,
  states: StateConfig[] = [],
  components: Array<View<ComponentTemplate>> = [],
  extenders: Extender[] = [],
  middlewares: Array<Middleware | Middlewares> = [],
  mixins: Array<Mixin<any, any>> = []
): [Node<T>, Array<View<ComponentTemplate>>, Extender[]] {
  let routerExtend: Extend | undefined;
  if (states) {
    routerExtend = initiateRouter(states);
    mixins = [routerMixin];
    extenders = extenders.concat(routerExtend.extenders);
    middlewares = [...middlewares, ...routerExtend.middlewares];
  }
  const node: Node<T> = create(initialValue, reducer, mixins, middlewares);
  if (routerExtend) {
    routerExtend.actions.subscribe((a) => {
      node.next(a);
    });
  }
  return [node, components, extenders];
}
