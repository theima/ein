import { DynamicProperty } from '../../types-and-interfaces/dynamic-property';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { Property } from '../../types-and-interfaces/property';
import { isDynamicProperty } from '../type-guards/is-dynamic-property';
import { joinModelUpdatesIfNeeded } from './join-model-updates-if-needed';

export function setProperties(element: HTMLElement, templateProperties: Array<Property | DynamicProperty>): ModelUpdate | undefined {
  let updates: ModelUpdate[] = [];
  templateProperties.forEach((p) => {
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
  return joinModelUpdatesIfNeeded(updates);
}
