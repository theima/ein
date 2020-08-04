
import { ModelToString, Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { isDynamicProperty } from '../type-guards/is-dynamic-property';
import { isElementTemplate } from '../type-guards/is-element-template';
import { isModelToString } from '../type-guards/is-model-to-string';
import { modelToStringToDynamicNode } from './model-to-string-to-dynamic-node';

export function elementTemplateToDynamicNode(elementToContent: ElementTemplateToDynamicNode,
                                             template: ElementTemplate,
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
  const element = document.createElement(template.name);
  const updates: Array<(m: Value) => void> = [];
  template.properties.forEach((p) => {
    let value = p.value;
    if (isDynamicProperty(p)) {
      value = '';
      updates.push(
        (m) => {
          element.setAttribute(p.name, p.value(m) as any);
        }
      );
    }
    element.setAttribute(p.name, value as any);
  });
  template.content.forEach((c) => {
    const content = toContent(c, node);
    element.appendChild(content.node);
    if (content.update) {
      updates.push(content.update);
    }
  });
  const update = (m: Value) => {
    updates.forEach((u) => {
      u(m);
    });
  };
  let result: DynamicNode = {
    node: element,
    update
  };

  return result;
}
