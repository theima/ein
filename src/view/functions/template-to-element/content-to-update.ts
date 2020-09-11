import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';
import { joinModelUpdatesIfNeeded } from './join-model-updates-if-needed';

export function contentToUpdate(content:DynamicElement[]):ModelUpdate | undefined {
  let updates: ModelUpdate[] = [];
  content.forEach((c) => {
    const element = c;
    if (element.contentUpdate) {
      updates.push(element.contentUpdate);
    }
    if (element.propertyUpdate) {
      updates.push(element.propertyUpdate);
    }
  });
  return joinModelUpdatesIfNeeded(updates);
}
