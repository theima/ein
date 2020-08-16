import { partial, Value } from '../../core';
import { chain } from '../../core/functions/chain';
import { NodeAsync } from '../../node-async';
import { ElementTemplateToDynamicNode } from '../types-and-interfaces/element-template-to-dynamic-node';
import { GetEventListener } from '../types-and-interfaces/get-event-listener';
import { DynamicNode } from '../types-and-interfaces/new-elements/dynamic-node';
import { NewModifier } from '../types-and-interfaces/new-modifier';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';
import { ViewTemplate } from '../types-and-interfaces/view-templates/view-template';
import { elementTemplateToDynamicNode } from './element-to-dynamic-node/element-template-to-dynamic-node';
import { newApplyViewTemplate } from './new-elements/new-apply-view-template';

export function createElementTemplateToDynamicNode(modifiers: NewModifier[], getViewTemplate: (name: string) => ViewTemplate | undefined, node:NodeAsync<Value>): (elementTemplate:ElementTemplate) => DynamicNode {
  let toElementFunc: ElementTemplateToDynamicNode;
  const elementToNode = (node: NodeAsync<Value>, getEventListener: GetEventListener, elementTemplate: ElementTemplate) => {
    const viewTemplate = getViewTemplate(elementTemplate.name);
    if (viewTemplate) {
      elementTemplate = newApplyViewTemplate(elementTemplate, viewTemplate);
    }
    return toElementFunc(elementTemplate, node, getEventListener);
  };
  const createElement: ElementTemplateToDynamicNode = partial(elementTemplateToDynamicNode, elementToNode);

  toElementFunc = chain(createElement, ...modifiers);
  const tempBlancActionHandler = () => () => {};
  return partial(elementToNode, node, tempBlancActionHandler);

}
