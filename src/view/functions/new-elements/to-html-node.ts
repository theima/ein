import { ModelToString, Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';
import { isDynamicProperty } from '../type-guards/is-dynamic-property';
import { isElementTemplate } from '../type-guards/is-element-template';
import { isModelToString } from '../type-guards/is-model-to-string';

export function toHtmlNode(template: ElementTemplate | string | ModelToString, node: NodeAsync<Value>): DynamicNode {
  if (isElementTemplate(template)) {
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
      const content = toHtmlNode(c, node);
      element.appendChild(content.node);
      if (content.update) {
        updates.push(content.update);
      }
    });
    const connectProperty = getProperty(BuiltIn.ConnectToNodeStream, template);
    const updater = (m: Value) => {
      updates.forEach((u) => {
        u(m);
      });
    };
    let update;
    if (connectProperty) {
      node.subscribe((m) => {
        updater(m);
      });
    } else {
      update = updater;
    }
    return {
      node: element,
      update
    };
  }
  if (isModelToString(template)) {
    const node = document.createTextNode('');
    const update = (m: Value) => {
      node.nodeValue = template(m);
    };

    return { node, update };
  }
  return {
    node: document.createTextNode(template)
  };

}
