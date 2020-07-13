import { chain } from '../../functions/chain';
import { Action } from '../types-and-interfaces/action';
import { ActionMap } from '../types-and-interfaces/action-map';
import { TriggerMiddleWare } from '../types-and-interfaces/trigger-middleware';

export function chainTriggerMiddleware<T>(last: ActionMap<T>,
                                          middleware: TriggerMiddleWare[]): ActionMap<T> {
  let currentModel: any;
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
  const group: (model: any, action: Action) => any = (model: any, action: Action) => {
    currentModel = model;
    chained(action);
    return currentModel;
  };
  return group;
}
