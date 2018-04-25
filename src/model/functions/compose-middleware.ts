import { Node } from '../types-and-interfaces/node';
import { Action } from '../types-and-interfaces/action';
import { Middleware } from '../types-and-interfaces/middleware';
import { compose } from './compose';

export function composeMiddleware<T>(emce: Node<any>,
                                     last: (action: Action) => Action,
                                     middleware: Middleware[]): (action: Action) => Action {
  const value: () => any = () => {
    return emce.value;
  };
  const next: (action: Action) => Action = (action: Action) => {
    return emce.next.apply(emce, [action]);
  };
  return compose(last, ...middleware
    .map((m: Middleware) => {
      return m(next, value);
    }));
}
