import { Action, Node, Value } from '../../../../core';
import { ActionMap } from '../../../types-and-interfaces/action-map';
import { ActionHandler } from '../../../types-and-interfaces/to-rendered-content/action-handler';
import { createActionHandler } from '../action-handling/create-action-handler';
import { toEvent } from './to-event';

export function createViewActionHandler(
  modelMap: (m: Value) => Value,
  element: HTMLElement,
  node: Node<Value>,
  actionMap?: ActionMap
): ActionHandler | undefined {
  if (actionMap) {
    const handler = (a: Action) => {
      const event = toEvent(a);
      element.dispatchEvent(event);
    };
    const value = () => modelMap(node.value);
    return createActionHandler(value, handler, actionMap);
  }
}
