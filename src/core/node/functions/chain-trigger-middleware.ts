import { chain } from '../../functions/chain';
import { Action } from '../types-and-interfaces/action';
import { Reducer } from '../types-and-interfaces/reducer';
import { TriggerMiddleWare } from '../types-and-interfaces/trigger-middleware';

export function chainTriggerMiddleware<T>(last: Reducer<T>,
                                          middleware: TriggerMiddleWare[]): Reducer<T> {
  let currentModel: T;
  const final: (action: Action) => void = (action: Action) => {
    currentModel = last(currentModel, action);
  };
  const value: () => any = () => {
    return currentModel;
  };
  const chained: (action: Action) => void = chain(final, ...middleware
    .map((m: TriggerMiddleWare) => {
      return m(value);
    }));
  const group: (model: T, action: Action) => any = (model: T, action: Action) => {
    currentModel = model;
    chained(action);
    return currentModel;
  };
  return group;
}
