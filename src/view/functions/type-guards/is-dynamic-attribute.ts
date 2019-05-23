import { Property } from '../../types-and-interfaces/property';
import { DynamicProperty } from '../..';

export function isDynamicAttribute(attribute: Property | DynamicProperty): attribute is DynamicProperty {
  return typeof attribute.value === 'function';
}
