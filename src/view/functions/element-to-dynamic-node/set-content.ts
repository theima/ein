import { ModelToString, Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { GetEventListener } from '../../types-and-interfaces/get-event-listener';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/templates/element-template-content';
import { createModelUpdateIfNeeded } from './create-model-update-if-needed';

export function setContent(contentToDynamicNode: (template: ElementTemplate | string | ModelToString, node: NodeAsync<Value>, getEventListener: GetEventListener) => DynamicNode,
                           element: HTMLElement,
                           content: ElementTemplateContent,
                           node: NodeAsync<Value>,
                           getEventListener: GetEventListener): ModelUpdate | undefined {
  let updates: ModelUpdate[] = [];
  content.forEach((c) => {
    const content = contentToDynamicNode(c, node, getEventListener);
    element.appendChild(content.node);
    content.afterAdd?.(content.node as HTMLElement);
    if (content.contentUpdate) {
      updates.push(content.contentUpdate);
    }
    if (content.propertyUpdate) {
      updates.push(content.propertyUpdate);
    }
  });
  return createModelUpdateIfNeeded(updates);
}
