import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { joinModelUpdatesIfNeeded } from './join-model-updates-if-needed';

export function contentToUpdate(content:DynamicNode[]):ModelUpdate | undefined {
  let updates: ModelUpdate[] = [];
  content.forEach((c) => {
    const dynamicNode = c;
    if (dynamicNode.contentUpdate) {
      updates.push(dynamicNode.contentUpdate);
    }
    if (dynamicNode.propertyUpdate) {
      updates.push(dynamicNode.propertyUpdate);
    }
  });
  return joinModelUpdatesIfNeeded(updates);
}
