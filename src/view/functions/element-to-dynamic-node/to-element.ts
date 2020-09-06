
import { ElementTemplateContentToDynamicNodes } from '../../types-and-interfaces/element-template-content-to-dynamic-nodes';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewScope } from '../../types-and-interfaces/view-scope';
import { setContent } from './set-content';
import { setProperties } from './set-properties';

export function toElement(contentToDynamicNode: ElementTemplateContentToDynamicNodes,
                          childScope: ViewScope,
                          elementTemplate: ElementTemplate): DynamicNode {
  const element = document.createElement(elementTemplate.name);
  const propertyUpdate = setProperties(element, elementTemplate.properties);
  const contentUpdate = setContent(element, contentToDynamicNode(childScope, elementTemplate.content));
  let result: DynamicNode = {
    node: element,
    contentUpdate,
    propertyUpdate
  };
  return result;
}
