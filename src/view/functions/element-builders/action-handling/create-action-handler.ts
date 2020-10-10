import { Action, Value } from '../../../../core';
import { ActionMap } from '../../../types-and-interfaces/action-map';
import { ActionHandler } from '../../../types-and-interfaces/to-rendered-content/action-handler';
import { toViewAction } from './to-view-action';

export function createActionHandler(value: () => Value,
                                    handler: (action: Action) => void,
                                    actionMap: ActionMap): ActionHandler {
  return (name: string, detail: Record<string, unknown>, action: Action) => {
    const model: Value = value();
    const mapped = actionMap(model, toViewAction(name, action, detail));
    if (mapped) {
      handler(mapped);
    }
  };
}
