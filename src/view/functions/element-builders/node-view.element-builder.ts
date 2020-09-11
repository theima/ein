import { Action, Node, Value } from '../../../core';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';
import { TemplateToElement } from '../../types-and-interfaces/to-element/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-element/view-scope';
import { NodeViewTemplate } from '../../types-and-interfaces/view-template/node-view-template';
import { createActionHandler } from './action-handling/create-action-handler';
import { toGetActionListener } from './action-handling/to-get-action-listener';
import { applyViewTemplate } from './apply-view-template';
import { connectToNode } from './node-view-builder/connect-to-node';
import { getNode } from './node-view-builder/get-node';

export function nodeViewElementBuilder(getViewTemplate: (name: string) => NodeViewTemplate | undefined,
                                       toContent: (scope: ViewScope, content: ElementTemplateContent[]) => DynamicElement[]) {
  return (create: TemplateToElement) => {
    let isFirstCall = true;
    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const viewTemplate = getViewTemplate(elementTemplate.name);
      if (viewTemplate) {
        let node: Node<Value>;
        if (isFirstCall) {
          isFirstCall = false;
          node = scope.node;
        } else {
          node = getNode(elementTemplate, scope.node, viewTemplate.reducer);
        }
        elementTemplate = applyViewTemplate(elementTemplate, viewTemplate);
        const getEventListener = toGetActionListener(createActionHandler(node, (action: Action) => node.next(action), viewTemplate.actionMap));
        const childScope: ViewScope = {
          node,
          getActionListener: getEventListener,
          getContent: () => []
        };
        const result = create(childScope, elementTemplate);
        connectToNode(node, result);
        return { element: result.element };
      }
      return create(scope, elementTemplate);

    };

  };
}
