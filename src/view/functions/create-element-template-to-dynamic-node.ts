import { partial, Value } from '../../core';
import { chain } from '../../core/functions/chain';
import { NodeAsync } from '../../node-async';
import { ElementTemplateToDynamicNode } from '../types-and-interfaces/element-template-to-dynamic-node';
import { NewModifier } from '../types-and-interfaces/new-modifier';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';
import { ViewTemplate } from '../types-and-interfaces/view-templates/view-template';
import { elementTemplateToDynamicNode } from './element-to-dynamic-node/element-template-to-dynamic-node';
import { newApplyViewTemplate } from './new-elements/new-apply-view-template';

export function createElementTemplateToDynamicNode(modifiers: NewModifier[], getViewTemplate: (name: string) => ViewTemplate | undefined): ElementTemplateToDynamicNode {
  let toElementFunc: ElementTemplateToDynamicNode;
  const elementToNode = (elementTemplate: ElementTemplate, node: NodeAsync<Value>) => {
    const viewTemplate = getViewTemplate(elementTemplate.name);
    if (viewTemplate) {
      elementTemplate = newApplyViewTemplate(elementTemplate, viewTemplate);
    }
    return toElementFunc(elementTemplate, node);
  };
  const createElement: ElementTemplateToDynamicNode = partial(elementTemplateToDynamicNode, elementToNode);

  toElementFunc = chain(createElement, ...modifiers);

  return elementToNode;

}
