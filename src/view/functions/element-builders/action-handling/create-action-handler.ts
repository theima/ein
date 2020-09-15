import { Action, Node, Value } from '../../../../core';
import { ActionMap } from '../../../../html-parser/types-and-interfaces/action-map';
import { ActionHandler } from '../../../types-and-interfaces/to-rendered-content/action-handler';
import { toViewAction } from './to-view-action';

export function createActionHandler(node: Node<Value>,
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
