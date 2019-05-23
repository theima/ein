import { Property } from '../../types-and-interfaces/property';
import { DynamicProperty } from '../..';
import { isDynamicAttribute } from '../type-guards/is-dynamic-attribute';

export function mapAttributes(attributes: Array<Property | DynamicProperty>, model: object): Property[] {
  return attributes.map(a => {
    if (isDynamicAttribute(a)) {
      return {...a, value: a.value(model)};
    }
    return a;
  });
}
