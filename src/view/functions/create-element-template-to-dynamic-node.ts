import { partial, Value } from '../../core';
import { NodeAsync } from '../../node-async';
import { ElementTemplateToDynamicNode } from '../types-and-interfaces/element-template-to-dynamic-node';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';
import { ViewTemplate } from '../types-and-interfaces/view-templates/view-template';
import { elementTemplateToDynamicNode } from './element-to-dynamic-node/element-template-to-dynamic-node';
import { newApplyViewTemplate } from './new-elements/new-apply-view-template';
import { connectActionsToNodeModifier } from './new-modifiers/connect-actions-to-node.modifier';
import { connectToNodeModifier } from './new-modifiers/connect-to-node.modifier';
import { createChildNodeModifier } from './new-modifiers/create-child-node.modifier';

export function createElementTemplateToDynamicNode(getViewTemplate: (name: string) => ViewTemplate | undefined): ElementTemplateToDynamicNode {
  const d = (element: ElementTemplate, node: NodeAsync<Value>) => {
    let toElementFunc: ElementTemplateToDynamicNode;
    const elementToNode = (elementTemplate: ElementTemplate, node: NodeAsync<Value>) => {
      const viewTemplate = getViewTemplate(elementTemplate.name);
      if (viewTemplate) {
        elementTemplate = newApplyViewTemplate(elementTemplate, viewTemplate);
      }
      return toElementFunc(elementTemplate, node);
    };
    const createElement: ElementTemplateToDynamicNode = partial(elementTemplateToDynamicNode, elementToNode);
    const ctnModifier: ElementTemplateToDynamicNode = connectToNodeModifier(createElement);
    const connectActionsModifier: ElementTemplateToDynamicNode = connectActionsToNodeModifier(ctnModifier);
    const childNodeModifier: ElementTemplateToDynamicNode = createChildNodeModifier(connectActionsModifier);
    toElementFunc = childNodeModifier;
    const root = elementToNode(element, node);
    return root;
  };
  return d;

}
