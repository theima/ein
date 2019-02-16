import { WrappedModelValue } from '../types-and-interfaces/wrapped-model-value';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { partsToString } from './parts-to-string';

export function stringMap(getParts: (wrapped: WrappedModelValue) => Array<string | ModelToValue>,
                          wrapped: WrappedModelValue): ModelToString {
  const parts = getParts(wrapped);
  return (model: object) => {
    return partsToString(parts, model);
  };
}
