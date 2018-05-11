import { Element } from '../types-and-interfaces/element';
import { Attribute } from '../types-and-interfaces/attribute';

export function getAttribute(element: Element, attributeName: string): Attribute | null {
  return element.attributes.find(p => p.name === attributeName) || null;
}
