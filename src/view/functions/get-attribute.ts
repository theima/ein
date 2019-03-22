import { Attribute } from '../types-and-interfaces/attribute';
export function getAttribute(attributeName: string, attributes: Attribute[]): Attribute | null;
export function getAttribute<T extends {name: string, attributes: Attribute[]}>(attributeName: string, element: T): Attribute | null;
export function getAttribute<T extends {name: string, attributes: Attribute[]}>(attributeName: string, elementOrAttributes: T | Attribute[]): Attribute | null {
  if (!Array.isArray(elementOrAttributes)) {
    elementOrAttributes = elementOrAttributes.attributes;
  }
  return elementOrAttributes.find(p => p.name === attributeName) || null;
}
