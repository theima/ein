import { Node, Value } from '../../../core';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { TemplateContentToRenderedContentList } from '../../types-and-interfaces/to-rendered-content/template-content-to-rendered-content-list';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { NodeViewTemplate } from '../../types-and-interfaces/view-template/node-view-template';
import { addOnDestroy } from '../template-to-rendered-content/add-on-destroy';
import { applyViewTemplate } from './apply-view-template';
import { connectToNode } from './node-view-builder/connect-to-node';
import { createNodeActionListener } from './node-view-builder/create-node-action-listener';
import { getNode } from './node-view-builder/get-node';

export function nodeViewElementBuilder(
  getViewTemplate: (name: string) => NodeViewTemplate | undefined,
  toContent: TemplateContentToRenderedContentList
): (next: TemplateToElement) => TemplateToElement {
  return (create: TemplateToElement) => {
    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const viewTemplate = getViewTemplate(elementTemplate.name);
      if (viewTemplate) {
        const node: Node<Value> = getNode(elementTemplate, scope.node, viewTemplate.reducer);
        elementTemplate = applyViewTemplate(elementTemplate, viewTemplate);
        const childScope: ViewScope = {
          node,
          getActionListener: createNodeActionListener(node, viewTemplate.actionMap),
          handleContent: () => [],
        };
        const result = create(childScope, elementTemplate);
        const unsubscribe = connectToNode(node, result);

        return addOnDestroy({ isElement: true, element: result.element }, () => {
          unsubscribe?.unsubscribe();
        });
      }
      return create(scope, elementTemplate);
    };
  };
}
