import { WrappedDynamicValueString } from '../types-and-interfaces/wrapped-dynamic-value-string';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { partsToString } from './parts-to-string';

export function stringMap(getParts: (wrapped: WrappedDynamicValueString) => Array<string | ModelToValue>,
                          wrapped: WrappedDynamicValueString): ModelToString {
  const parts = getParts(wrapped);
  return (model: object) => {
    return partsToString(parts, model);
  };
}
