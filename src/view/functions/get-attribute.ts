import { Attribute } from '../types-and-interfaces/attribute';
export function getAttribute(attributes: Attribute[], attributeName: string): Attribute | null;
export function getAttribute<T extends {name: string, attributes: Attribute[]}>(element: T, attributeName: string): Attribute | null;
export function getAttribute<T extends {name: string, attributes: Attribute[]}>(elementOrAttributes: T | Attribute[], attributeName: string): Attribute | null {
  if (!Array.isArray(elementOrAttributes)) {
    elementOrAttributes = elementOrAttributes.attributes;
  }
  return elementOrAttributes.find(p => p.name === attributeName) || null;
}
