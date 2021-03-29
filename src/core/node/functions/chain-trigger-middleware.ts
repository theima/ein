import { chain } from '../../functions/chain';
import { Action } from '../types-and-interfaces/action';
import { TriggerMiddleWare } from '../types-and-interfaces/trigger-middleware';

export function chainTriggerMiddleware<T>(
  last: (model: T, action?: Action) => T,
  middleware: TriggerMiddleWare[]
): (model: T, action?: Action) => T {
  let currentModel: T;
  const final: (action: Action) => void = (action: Action) => {
    currentModel = last(currentModel, action);
  };
  const value: () => any = () => {
    return currentModel;
  };
  const chained: (action: Action) => void = chain(
    final,
    ...middleware.map((m: TriggerMiddleWare) => {
      return m(value);
    })
  );
  const group: (model: T, action?: Action) => any = (
    model: T,
    action?: Action
  ) => {
    currentModel = model;
    chained(action as any);
    return currentModel;
  };
  return group;
}
