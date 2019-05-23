import { Property } from '../../types-and-interfaces/property';
import { DynamicProperty } from '../..';
import { isDynamicAttribute } from '../type-guards/is-dynamic-attribute';

export function mapProperties(properties: Array<Property | DynamicProperty>, model: object): Property[] {
  return properties.map(a => {
    if (isDynamicAttribute(a)) {
      return {...a, value: a.value(model)};
    }
    return a;
  });
}
