import { WrappedDynamicValueString } from '../types-and-interfaces/wrapped-dynamic-value-string';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { partsToString } from './parts-to-string';

export function valueMap(getParts: (wrapped: WrappedDynamicValueString) => Array<string | ModelToValue>,
                         wrapped: WrappedDynamicValueString): ModelToValue {
  const parts = getParts(wrapped);
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
    return partsToString(parts, model);
  };
}
