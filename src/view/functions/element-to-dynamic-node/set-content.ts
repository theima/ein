import { ModelToString, Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/templates/element-template-content';
import { createModelUpdateIfNeeded } from './create-model-update-if-needed';

export function setContent(contentToDynamicNode: (template: ElementTemplate | string | ModelToString, node: NodeAsync<Value>) => DynamicNode,
                           element: HTMLElement,
                           content: ElementTemplateContent,
                           node: NodeAsync<Value>): ModelUpdate | undefined {
  let updates: ModelUpdate[] = [];
  content.forEach((c) => {
    const content = contentToDynamicNode(c, node);
    element.appendChild(content.node);
    if (content.update) {
      updates.push(content.update);
    }
  });
  return createModelUpdateIfNeeded(updates);
}
