import { WrappedDynamicValueString } from '../../types-and-interfaces/wrapped-dynamic-value-string';
import { ModelToValue } from '../../../view/types-and-interfaces/model-to-value';
import { joinAsString } from './join-as-string';

export function wrappedToModelToValue(getMappedArray: (wrapped: WrappedDynamicValueString) => Array<string | ModelToValue>,
                                      wrapped: WrappedDynamicValueString): ModelToValue {
  const parts = getMappedArray(wrapped);
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
