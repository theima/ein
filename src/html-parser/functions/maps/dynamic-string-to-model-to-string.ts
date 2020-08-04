import { Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { ModelToValue } from '../../../core/types-and-interfaces/model-to-value';
import { DynamicString } from '../../types-and-interfaces/dynamic-string';
import { joinAsString } from './join-as-string';

export function dynamicStringToModelToString(getMappedArray: (dynamic: DynamicString) => Array<string | ModelToValue>,
                                             dynamic: DynamicString): ModelToString | string {
  const parts = getMappedArray(dynamic);
  if (parts.length === 1) {
    return parts[0] as string;
  }
  return (model: Value) => {
    return joinAsString(parts, model);
  };
}
