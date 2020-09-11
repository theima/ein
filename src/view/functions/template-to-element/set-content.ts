
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';
import { joinModelUpdatesIfNeeded } from './join-model-updates-if-needed';

export function setContent(element: HTMLElement,
                           content: DynamicElement[]): ModelUpdate | undefined {
  let updates: ModelUpdate[] = [];
  content.forEach((c) => {
    const dynamicElement = c;
    element.appendChild(dynamicElement.element);
    dynamicElement.afterAdd?.(dynamicElement.element as HTMLElement);
    if (dynamicElement.contentUpdate) {
      updates.push(dynamicElement.contentUpdate);
    }
    if (dynamicElement.propertyUpdate) {
      updates.push(dynamicElement.propertyUpdate);
    }
  });
  return joinModelUpdatesIfNeeded(updates);
}
