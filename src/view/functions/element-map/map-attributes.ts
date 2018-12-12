import { Attribute } from '../../types-and-interfaces/attribute';
import { DynamicAttribute } from '../..';
import { isDynamicAttribute } from '../type-guards/is-dynamic-attribute';

export function mapAttributes(attributes: Array<Attribute | DynamicAttribute>, model: object): Attribute[] {
  return attributes.map(a => {
    if (isDynamicAttribute(a)) {
      return {...a, value: a.value(model)};
    }
    return a;
  });
}
