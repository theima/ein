
import { ModelToString, Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { GetEventListener } from '../../types-and-interfaces/get-event-listener';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { isElementTemplate } from '../type-guards/is-element-template';
import { isModelToString } from '../type-guards/is-model-to-string';
import { modelToStringToDynamicNode } from './model-to-string-to-dynamic-node';
import { setContent } from './set-content';
import { setProperties } from './set-properties';

export function elementTemplateToDynamicNode(elementToContent: (node: NodeAsync<Value>, getEventListener: GetEventListener, elementTemplate: ElementTemplate) => DynamicNode,
                                             elementTemplate: ElementTemplate,
                                             node: NodeAsync<Value>,
                                             getEventListener: GetEventListener): DynamicNode {
  const toContent = (template: ElementTemplate | string | ModelToString, node: NodeAsync<Value>, getEventListener: GetEventListener) => {
    if (isElementTemplate(template)) {
      return elementToContent(node, getEventListener, template);
    }else if (isModelToString(template)) {
      return modelToStringToDynamicNode(template);
    }
    return {
    node: document.createTextNode(template)
    };
  };
  const element = document.createElement(elementTemplate.name);
  const propertyUpdate = setProperties(element, elementTemplate.properties);
  const contentUpdate = setContent(toContent, element, elementTemplate.content, node, getEventListener);
  let result: DynamicNode = {
    node: element,
    contentUpdate,
    propertyUpdate
  };

  return result;
}
