import { Action, Node, Value } from '../../../../core';
import { GetActionListener } from '../../../types-and-interfaces/to-rendered-content/get-action-listener';
import { NodeViewTemplate } from '../../../types-and-interfaces/view-template/node-view-template';
import { createActionHandler } from '../action-handling/create-action-handler';
import { toGetActionListener } from '../action-handling/to-get-action-listener';

export function createNodeActionListener(node: Node<Value>, viewTemplate: NodeViewTemplate): GetActionListener {
  return toGetActionListener(createActionHandler(node, (action: Action) => node.next(action), viewTemplate.actionMap));
}
