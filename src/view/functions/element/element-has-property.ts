import { Element } from '../../types-and-interfaces/elements/element';

export function elementHasProperty(element: Element, propertyName: string): boolean {
  return element.properties.some(p => p.name === propertyName);
}
