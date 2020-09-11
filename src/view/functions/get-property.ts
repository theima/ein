import { Property } from '../types-and-interfaces/element-template/property';

export function getProperty<T extends {name: string, properties: Property[]}>(propertyName: string, element: T): Property | undefined{
  return element.properties.find((p) => p.name === propertyName);
}
