import { Node, Value } from '../../core';
import { DynamicElement } from '../types-and-interfaces/to-rendered-content/dynamic-element';
import { TemplateToElement } from '../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../types-and-interfaces/to-rendered-content/view-scope';
import { NodeViewTemplate } from '../types-and-interfaces/view-template/node-view-template';
import { applyViewTemplate } from './element-builders/apply-view-template';
import { createNodeActionListener } from './element-builders/node-view-builder/create-node-action-listener';

export function createRoot<T>(
  viewTemplate: NodeViewTemplate,
  rootNode: Node<T>,
  templateToElement: TemplateToElement
): DynamicElement {
  const node: Node<Value> = (rootNode as Node<unknown>) as Node<Value>;
  const elementTemplate = applyViewTemplate(
    { name: viewTemplate.name, content: [], properties: [] },
    viewTemplate
  );
  const getActionListener = createNodeActionListener(
    node,
    viewTemplate.actionMap
  );
  const rootScope: ViewScope = {
    node,
    getActionListener,
    handleContent: () => []
  };
  const root = templateToElement(rootScope, elementTemplate);
  node.subscribe((m) => {
    root.contentUpdate?.(m as any);
  });
  return root;
}
