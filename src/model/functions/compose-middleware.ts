import { Node } from '../types-and-interfaces/node';
import { Action } from '../types-and-interfaces/action';
import { Middleware } from '../types-and-interfaces/middleware';
import { compose } from './compose';

export function composeMiddleware<T>(node: Node<any>,
                                     last: (action: Action) => Action,
                                     middleware: Middleware[]): (action: Action) => Action {
  const value: () => any = () => {
    return node.value;
  };
  const next: (action: Action) => Action = (action: Action) => {
    return node.next.apply(node, [action]);
  };
  return compose(last, ...middleware
    .map((m: Middleware) => {
      return m(next, value);
    }));
}
