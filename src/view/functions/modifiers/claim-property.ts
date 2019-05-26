import { TemplateElement } from '../..';

export function claimProperty<T extends TemplateElement>(propertyName: string, element: T): T {
  return {...element, properties: element.properties.filter(e => e.name !== propertyName)};
}
