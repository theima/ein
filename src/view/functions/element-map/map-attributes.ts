import { Attribute } from '../../types-and-interfaces/attribute';
import { DynamicAttribute } from '../..';

export function mapAttributes(attributes: Array<Attribute | DynamicAttribute>, model: object): Attribute[] {
  return attributes.map(a => {
    if (typeof a.value !== 'function') {
      return a as Attribute;
    }
    return {...a, value: a.value(model)};
  });
}
