import { Property } from '../../types-and-interfaces/property';
import { DynamicProperty } from '../..';
import { isDynamicProperty } from '../type-guards/is-dynamic-property';

export function mapProperties(properties: Array<Property | DynamicProperty>, model: object): Property[] {
  return properties.map(a => {
    if (isDynamicProperty(a)) {
      return {...a, value: a.value(model)};
    }
    return a;
  });
}
