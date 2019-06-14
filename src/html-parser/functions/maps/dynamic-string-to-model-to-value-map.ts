import { dynamicString } from '../../types-and-interfaces/dynamic-string';
import { ModelToValue } from '../../../view/types-and-interfaces/model-to-value';
import { joinAsString } from './join-as-string';

export function dynamicStringToModelToValue(getMappedArray: (dynamic: dynamicString) => Array<string | ModelToValue>,
                                            dynamic: dynamicString): ModelToValue {
  const parts = getMappedArray(dynamic);
  let single: ModelToValue;
  if (parts.length === 1) {
    const part = parts[0];
    if (typeof part === 'function') {
      single = part;
    }
  }
  return (model: object) => {
    if (single) {
      return single(model);
    }
    return joinAsString(parts, model);
  };
}
