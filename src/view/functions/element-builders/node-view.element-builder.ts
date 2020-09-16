import { Action, Node, Value } from '../../../core';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';
import { DynamicContent } from '../../types-and-interfaces/to-rendered-content/dynamic-content';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { NodeViewTemplate } from '../../types-and-interfaces/view-template/node-view-template';
import { addOnDestroy } from '../template-to-rendered-content/add-on-destroy';
import { createActionHandler } from './action-handling/create-action-handler';
import { toGetActionListener } from './action-handling/to-get-action-listener';
import { applyViewTemplate } from './apply-view-template';
import { connectToNode } from './node-view-builder/connect-to-node';
import { getNode } from './node-view-builder/get-node';

export function nodeViewElementBuilder(getViewTemplate: (name: string) => NodeViewTemplate | undefined,
                                       toContent: (scope: ViewScope, content: ElementTemplateContent[]) => DynamicContent[]) {
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
        const getActionListener = toGetActionListener(createActionHandler(node, (action: Action) => node.next(action), viewTemplate.actionMap));
        const childScope: ViewScope = {
          node,
          getActionListener,
          handleContent: () => []
        };
        const result = create(childScope, elementTemplate);
        const unsubscribe = connectToNode(node, result);

        return addOnDestroy({isElement: true, element: result.element }, () => { unsubscribe?.unsubscribe(); });
      }
      return create(scope, elementTemplate);

    };

  };
}
