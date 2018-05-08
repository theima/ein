import { Element } from '../types-and-interfaces/element';
import { Attribute } from '..';

export function getAttribute(element: Element, attributeName: string): Attribute | null {
  return element.attributes.find(p => p.name === attributeName) || null;
}
