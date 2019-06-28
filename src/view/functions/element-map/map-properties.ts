import { Property } from '../../types-and-interfaces/property';
import { DynamicProperty } from '../..';
import { isDynamicProperty } from '../type-guards/is-dynamic-property';
import { Value } from '../../../core';

export function mapProperties(properties: Array<Property | DynamicProperty>, model: Value): Property[] {
  return properties.map(a => {
    if (isDynamicProperty(a)) {
      return {...a, value: a.value(model)};
    }
    return a;
  });
}
