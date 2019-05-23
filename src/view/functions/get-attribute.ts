import { Property } from '../types-and-interfaces/property';
export function getAttribute(attributeName: string, attributes: Property[]): Property | null;
export function getAttribute<T extends {name: string, attributes: Property[]}>(attributeName: string, element: T): Property | null;
export function getAttribute<T extends {name: string, attributes: Property[]}>(attributeName: string, elementOrAttributes: T | Property[]): Property | null {
  if (!Array.isArray(elementOrAttributes)) {
    elementOrAttributes = elementOrAttributes.attributes;
  }
  return elementOrAttributes.find(p => p.name === attributeName) || null;
}
