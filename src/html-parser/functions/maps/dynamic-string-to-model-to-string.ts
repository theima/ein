import { Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { ModelToValue } from '../../../core/types-and-interfaces/model-to-value';
import { dynamicString } from '../../types-and-interfaces/dynamic-string';
import { joinAsString } from './join-as-string';

export function dynamicStringToModelToString(getMappedArray: (dynamic: dynamicString) => Array<string | ModelToValue>,
                                             dynamic: dynamicString): ModelToString | string {
  const parts = getMappedArray(dynamic);
  if (parts.length === 1) {
    return parts[0] as string;
  }
  return (model: Value) => {
    return joinAsString(parts, model);
  };
}
