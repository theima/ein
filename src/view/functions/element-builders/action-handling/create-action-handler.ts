import { Action, Value } from '../../../../core';
import { ActionMap } from '../../../../html-parser/types-and-interfaces/action-map';
import { NodeAsync } from '../../../../node-async';
import { ActionHandler } from '../../../types-and-interfaces/action-handler';
import { toViewAction } from './to-view-action';

export function createActionHandler(node: NodeAsync<Value>,
                                    handler: (action: Action) => void,
                                    actionMap: ActionMap): ActionHandler {
  return (name: string, action: Action) => {
    const model: Value = node.value;
    const mapped = actionMap(model, toViewAction(name, action));
    if (mapped) {
      handler(mapped);
    }
  };
}
