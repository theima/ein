import { compose } from '../../functions/compose';
import { Action } from '../types-and-interfaces/action';
import { TriggerMiddleWare } from '../types-and-interfaces/trigger-middleware';

export function composeTriggerMiddleware(last: (model: any, action: Action) => any,
                                         middleware: TriggerMiddleWare[]): (model: any, action: Action) => any {
  let currentModel: any = null;
  const final: (action: Action) => void = (action: Action) => {
    currentModel = last(currentModel, action);
  };
  const value: () => any = () => {
    return currentModel;
  };
  const composed: (action: Action) => void = compose(final, ...middleware
    .map((m: TriggerMiddleWare) => {
      return m(value);
    }));
  const group: (model: any, action: Action) => any = (model: any, action: Action) => {
    currentModel = model;
    composed(action);
    return currentModel;
  };
  return group;
}
