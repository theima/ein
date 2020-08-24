
import { Action, partial, Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { GetEventListener } from '../../types-and-interfaces/get-event-listener';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewAction } from '../../types-and-interfaces/view-action';
import { getProperty } from '../get-property';
import { connectToNode } from './view-modifier/connect-to-node';
import { getNode } from './view-modifier/get-node';
import { toEvent } from './view-modifier/to-event';
import { toViewAction } from './view-modifier/to-view-action';

export function viewModifier(next: ElementTemplateToDynamicNode) {
  let isFirstCall = true;
  return (elementTemplate: ElementTemplate, node: NodeAsync<Value>, getEventListener: GetEventListener) => {
    if (isFirstCall) {
      isFirstCall = false;
    } else {
      node = getNode(elementTemplate, node);
    }
    let result: DynamicNode;

    const actionMapProperty = getProperty(BuiltIn.Actions, elementTemplate);
    if (actionMapProperty) {
      const connectActionsProperty = getProperty(BuiltIn.ConnectActionsToNode, elementTemplate);
      const actionMap: (model:Value, viewAction: ViewAction) => Action | undefined = actionMapProperty.value as any;
      let handler: (a: Action) => void;
      const handleAction = (name: string, action: Action) => {
        const model: Value = node.value;
        const mapped = actionMap(model, toViewAction(name, action));
        if (mapped) {
          handler(mapped);
        }
      };

      result = next(elementTemplate, node, (name: string) => partial(handleAction, name));
      if (connectActionsProperty) {
        result = connectToNode(elementTemplate, node, result);
        handler = (a: Action) => {
          node.next(a);
        };
      } else {
        handler = (a: Action) => {
          const event = toEvent(a);
          result.node.dispatchEvent(event);
        };
      }
    } else {
      result = next(elementTemplate, node, getEventListener);
    }
    return result;
  };
}
