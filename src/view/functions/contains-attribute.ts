import { Property } from '../types-and-interfaces/property';
import { DynamicProperty } from '../types-and-interfaces/dynamic-property';

export function containsAttribute(attributeName: string, attributes: Array<Property | DynamicProperty>) {
  const names = attributes.map(a => a.name);
  return names.includes(attributeName);
}
