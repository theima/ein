import { ElementTemplate } from '../..';
import { hasProperty } from '../has-property';

export function removeProperty<T extends ElementTemplate>(propertyName: string, element: T): T {
  if (hasProperty(element, propertyName)) {
    return {...element, properties: element.properties.filter(e => e.name !== propertyName)};
  }
  return element;
}
