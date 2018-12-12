import { Attribute } from '../../types-and-interfaces/attribute';
import { DynamicAttribute } from '../..';

export function isDynamicAttribute(attribute: Attribute | DynamicAttribute): attribute is DynamicAttribute {
  return typeof attribute.value === 'function';
}
