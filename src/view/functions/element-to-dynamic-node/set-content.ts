
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { joinModelUpdatesIfNeeded } from './join-model-updates-if-needed';

export function setContent(element: HTMLElement,
                           content: DynamicNode[]): ModelUpdate | undefined {
  let updates: ModelUpdate[] = [];
  content.forEach((c) => {
    const dynamicNode = c;
    element.appendChild(dynamicNode.node);
    dynamicNode.afterAdd?.(dynamicNode.node as HTMLElement);
    if (dynamicNode.contentUpdate) {
      updates.push(dynamicNode.contentUpdate);
    }
    if (dynamicNode.propertyUpdate) {
      updates.push(dynamicNode.propertyUpdate);
    }
  });
  return joinModelUpdatesIfNeeded(updates);
}
