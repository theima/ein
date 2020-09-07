import { Dict, NullableValue, Value } from '../../../../core';
import { arrayToKeyValueDict } from '../../../../core/functions/dict/array-to-key-value-dict';
import { DynamicProperty } from '../../../types-and-interfaces/dynamic-property';
import { Property } from '../../../types-and-interfaces/property';
import { isDynamicProperty } from '../../type-guards/is-dynamic-property';

export function mapPropertiesToDict(properties: Array<DynamicProperty | Property>, model: Value): Dict<NullableValue> {
  const mapped = properties.map((p) => {
    if (isDynamicProperty(p)) {
      p = { ...p, value: p.value(model) };
    }
    return p;
  });
  return arrayToKeyValueDict('name', 'value', mapped);
}
