import { Property } from '../types-and-interfaces/property';
import { DynamicProperty } from '../types-and-interfaces/dynamic-property';

export function containsProperty(propertyName: string, properties: Array<Property | DynamicProperty>) {
  const names = properties.map(a => a.name);
  return names.includes(propertyName);
}
