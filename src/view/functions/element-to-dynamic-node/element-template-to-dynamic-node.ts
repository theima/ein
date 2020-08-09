
import { ModelToString, Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { isElementTemplate } from '../type-guards/is-element-template';
import { isModelToString } from '../type-guards/is-model-to-string';
import { modelToStringToDynamicNode } from './model-to-string-to-dynamic-node';
import { setContent } from './set-content';
import { setProperties } from './set-properties';

export function elementTemplateToDynamicNode(elementToContent: ElementTemplateToDynamicNode,
                                             templateElement: ElementTemplate,
                                             node: NodeAsync<Value>): DynamicNode {
  const toContent = (template: ElementTemplate | string | ModelToString, node: NodeAsync<Value>) => {
    if (isElementTemplate(template)) {
      return elementToContent(template, node);
    }else if (isModelToString(template)) {
      return modelToStringToDynamicNode(template);
    }
    return {
    node: document.createTextNode(template)
    };
  };
  const element = document.createElement(templateElement.name);
  const propertyUpdate = setProperties(element, templateElement.properties);
  const contentUpdate = setContent(toContent, element, templateElement.content, node);
  let result: DynamicNode = {
    node: element,
    contentUpdate,
    propertyUpdate
  };

  return result;
}
