import { Property } from '../../types-and-interfaces/property';
import { DynamicProperty } from '../..';

export function isDynamicProperty(property: Property | DynamicProperty): property is DynamicProperty {
  return typeof property.value === 'function';
}
