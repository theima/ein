import { dynamicString } from '../../types-and-interfaces/dynamic-string';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { joinAsString } from './join-as-string';
import { ModelToValue } from '../../../core/types-and-interfaces/model-to-value';

export function dynamicStringToModelToString(getMappedArray: (dynamic: dynamicString) => Array<string | ModelToValue>,
                                             dynamic: dynamicString): ModelToString {
  const parts = getMappedArray(dynamic);
  return (model: object) => {
    return joinAsString(parts, model);
  };
}