import { chain } from '../../functions/chain';
import { Func } from '../../types-and-interfaces/function/function';
import { Value } from '../../types-and-interfaces/value/value';
import { Action } from '../types-and-interfaces/action';
import { Middleware } from '../types-and-interfaces/middleware';
import { Node } from '../types-and-interfaces/node';
import { TriggerMiddleWare } from '../types-and-interfaces/trigger-middleware';

export function chainMiddleware<T extends Func>(
  node: Node<Value>,
  last: T,
  middleware: Middleware[] | Array<TriggerMiddleWare<any>>
): T {
  const value: () => Value = () => {
    return node.value;
  };
  const next: (action: Action) => Action = (action: Action) => {
    return node.next.apply(node, [action]);
  };
  return (chain(
    last,
    ...middleware.map((m: Middleware | TriggerMiddleWare<any>) => {
      return m(next, value);
    })
  ) as unknown) as T;
}
