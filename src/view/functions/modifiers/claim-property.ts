import { ElementTemplate } from '../..';

export function claimProperty<T extends ElementTemplate>(propertyName: string, element: T): T {
  return {...element, properties: element.properties.filter(e => e.name !== propertyName)};
}
