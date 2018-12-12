import { Attribute } from '../types-and-interfaces/attribute';

export function getAttribute<T extends {name: string, attributes: Attribute[]}>(element: T, attributeName: string): Attribute | null {
  return element.attributes.find(p => p.name === attributeName) || null;
}
