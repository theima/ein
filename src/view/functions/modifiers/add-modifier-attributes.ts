import { ElementData, TemplateElement } from '../..';
import { isGroupElementData } from '../type-guards/is-group-element-data';
import { Modifier } from '../../types-and-interfaces/modifier';

export function addModifierAttributes<T extends TemplateElement>(element: T, data: ElementData | null): T {
  if (isGroupElementData(data)) {
    const attributes = element.attributes.concat([{name: Modifier.Group, value: true}]);
    element = {...element, attributes};
  }
  return element;
}
