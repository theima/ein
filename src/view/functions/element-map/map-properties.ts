import { DynamicProperty } from '../..';
import { Value } from '../../../core';
import { Property } from '../../types-and-interfaces/property';
import { isDynamicProperty } from '../type-guards/is-dynamic-property';

export function mapProperties(properties: Array<Property | DynamicProperty>, model: Value): Property[] {
  return properties.map(a => {
    if (isDynamicProperty(a)) {
      return {...a, value: a.value(model)};
    }
    return a;
  });
}
