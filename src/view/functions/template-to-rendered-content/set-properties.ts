import { joinFunctionsIfNeeded } from '../../../core';
import { whenChanged } from '../../../core/functions/when-changed';
import { DynamicProperty } from '../../types-and-interfaces/element-template/dynamic-property';
import { Property } from '../../types-and-interfaces/element-template/property';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { isDynamicProperty } from '../type-guards/is-dynamic-property';

export function setProperties(element: HTMLElement, templateProperties: Array<Property | DynamicProperty>): ModelUpdate | undefined {
  const updates: ModelUpdate[] = [];

  templateProperties.forEach((p) => {
    let value = p.value;
    const setValue = whenChanged((value: string) => {
      element.setAttribute(p.name, value);
    });
    if (isDynamicProperty(p)) {
      value = '';
      updates.push(
        (m) => {
          setValue(p.value(m) + '');
        }
      );
    }
    element.setAttribute(p.name, value + '');
  });
  return joinFunctionsIfNeeded(updates);
}
