import { Action, Node, Value } from '../../../../core';
import { ActionMap } from '../../../types-and-interfaces/action-map';
import { GetActionListener } from '../../../types-and-interfaces/to-rendered-content/get-action-listener';
import { createActionHandler } from '../action-handling/create-action-handler';
import { toGetActionListener } from '../action-handling/to-get-action-listener';

export function createNodeActionListener(
  node: Node<Value>,
  actionMap: ActionMap
): GetActionListener {
  const value = () => node.value;
  return toGetActionListener(
    createActionHandler(value, (action: Action) => node.next(action), actionMap)
  );
}
