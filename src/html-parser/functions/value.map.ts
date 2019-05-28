import { WrappedModelValue } from '../types-and-interfaces/wrapped-model-value';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { partsToString } from './parts-to-string';

export function valueMap(getParts: (wrapped: WrappedModelValue) => Array<string | ModelToValue>,
                         wrapped: WrappedModelValue): ModelToValue {
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
