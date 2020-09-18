import { Dict, partial, Value } from '../../../../core';
import { ModelToValue } from '../../../../core/types-and-interfaces/model-to-value';
import { DynamicString } from '../../../types-and-interfaces/html-parser/dynamic-string';
import { ValueMap } from '../../../types-and-interfaces/value-map';
import { createParts } from './create-parts';
import { dynamicPartToModelToValue } from './dynamic-part-to-model-to-value';
import { joinAsString } from './join-as-string';

export function dynamicStringToModelToValue(maps: Dict<ValueMap>,
                                            dynamicString: DynamicString): ModelToValue | string {
  const parts = createParts(partial(dynamicPartToModelToValue, maps), dynamicString);
  if (parts.length === 1) {
    const part = parts[0];
    if (typeof part === 'string') {
      return part;
    }
    return (m: Value) => part(m);
  }
  return (model: Value) => joinAsString(parts, model);
}
