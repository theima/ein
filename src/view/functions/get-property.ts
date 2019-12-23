import { Property } from '../types-and-interfaces/property';
export function getProperty(propertyName: string, properties: Property[]): Property | null;
export function getProperty<T extends {name: string, properties: Property[]}>(propertyName: string, element: T): Property | null;
export function getProperty<T extends {name: string, properties: Property[]}>(propertyName: string, elementOrProperties: T | Property[]): Property | null {
  if (!Array.isArray(elementOrProperties)) {
    elementOrProperties = elementOrProperties.properties;
  }
  return elementOrProperties.find((p) => p.name === propertyName) || null;
}
