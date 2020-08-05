
import { ModelToString, Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { isElementTemplate } from '../type-guards/is-element-template';
import { isModelToString } from '../type-guards/is-model-to-string';
import { createModelUpdateIfNeeded } from './create-model-update-if-needed';
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
  const updates: ModelUpdate[] = [];
  const propertyUpdate = setProperties(element, templateElement.properties);
  if (propertyUpdate) {
    updates.push(propertyUpdate);
  }
  const contentUpdate = setContent(toContent, element, templateElement.content, node);
  if (contentUpdate) {
    updates.push(contentUpdate);
  }

  let result: DynamicNode = {
    node: element,
    update: createModelUpdateIfNeeded(updates)
  };

  return result;
}
