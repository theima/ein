
import { Action, partial, Value } from '../../../core';
import { ActionMap } from '../../../html-parser/types-and-interfaces/action-map';
import { NodeAsync } from '../../../node-async';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewScope } from '../../types-and-interfaces/view-scope';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';
import { toViewAction } from '../element-builders/action-handling/to-view-action';
import { connectToNode } from '../element-builders/node-view-builder/connect-to-node';
import { getNode } from '../element-builders/node-view-builder/get-node';
import { toEvent } from '../element-builders/view-builder/to-event';
import { newApplyViewTemplate } from '../new-elements/new-apply-view-template';
import { isNodeViewTemplate } from '../type-guards/is-node-view-template';

export function viewModifier(getViewTemplate: (name: string) => ViewTemplate | undefined, next: ElementTemplateToDynamicNode) {
  let isFirstCall = true;
  return (scope: ViewScope, elementTemplate: ElementTemplate) => {
    const viewTemplate = getViewTemplate(elementTemplate.name);
    let node: NodeAsync<Value>;
    if (viewTemplate) {
      if (isFirstCall) {
        isFirstCall = false;
        node = scope.node;
      } else if (isNodeViewTemplate(viewTemplate)) {
        node = getNode(elementTemplate, scope.node, viewTemplate.reducer);
      } else {
        node = scope.node;
      }
    } else {
      node = scope.node;
    }

    let result: DynamicNode;

    if (viewTemplate) {
      elementTemplate = newApplyViewTemplate(elementTemplate, viewTemplate);
      const actionMap: ActionMap | undefined = viewTemplate.actionMap;
      let handler: (a: Action) => void;
      const handleAction = (name: string, action: Action) => {
        if (actionMap) {
          const model: Value = node.value;
          const mapped = actionMap(model, toViewAction(name, action));
          if (mapped) {
            handler(mapped);
          }
        }
      };
      scope = {
        node,
        getEventListener: (name: string) => partial(handleAction, name),
        getContent: scope.getContent
      };
      result = next(scope, elementTemplate);
      if (isNodeViewTemplate(viewTemplate)) {
        connectToNode(node, result);
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
      result = next(scope, elementTemplate);
    }
    return result;
  };
}
