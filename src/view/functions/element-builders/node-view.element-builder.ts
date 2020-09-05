import { Action, Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewScope } from '../../types-and-interfaces/view-scope';
import { NodeViewTemplate } from '../../types-and-interfaces/view-templates/node-view-template';
import { newApplyViewTemplate } from '../new-elements/new-apply-view-template';
import { createActionHandler } from './action-handling/create-action-handler';
import { toGetEventListener } from './action-handling/to-get-event-listener';
import { connectToNode } from './node-view-builder/connect-to-node';
import { getNode } from './node-view-builder/get-node';

export function nodeViewElementBuilder(getViewTemplate: (name: string) => NodeViewTemplate | undefined,
                                       create: ElementTemplateToDynamicNode) {
  let isFirstCall = true;
  return (scope: ViewScope, elementTemplate: ElementTemplate) => {
    const viewTemplate = getViewTemplate(elementTemplate.name);
    if (viewTemplate) {
      let node: NodeAsync<Value>;
      if (isFirstCall) {
        isFirstCall = false;
        node = scope.node;
      } else {
        node = getNode(elementTemplate, scope.node, viewTemplate.reducer);
      }
      elementTemplate = newApplyViewTemplate(elementTemplate, viewTemplate);
      const getEventListener = toGetEventListener(createActionHandler(node,(action:Action) => node.next(action), viewTemplate.actionMap));
      const childScope: ViewScope = {
        node,
        getEventListener,
        getContent: () => []
      };
      const result = create(childScope,elementTemplate);
      connectToNode(node, result);
      return result;
    }
    return create(scope, elementTemplate);

  };

}
