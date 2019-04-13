import { Attribute } from '../types-and-interfaces/attribute';
import { DynamicAttribute } from '../types-and-interfaces/dynamic-attribute';

export function containsAttribute(attributeName: string, attributes: Array<Attribute | DynamicAttribute>) {
  const names = attributes.map(a => a.name);
  return names.includes(attributeName);
}
