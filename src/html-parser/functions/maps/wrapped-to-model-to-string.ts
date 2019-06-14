import { WrappedDynamicValueString } from '../../types-and-interfaces/wrapped-dynamic-value-string';
import { ModelToString } from '../../../view/types-and-interfaces/model-to-string';
import { ModelToValue } from '../../../view/types-and-interfaces/model-to-value';
import { joinAsString } from './join-as-string';

export function wrappedToModelToString(getMappedArray: (wrapped: WrappedDynamicValueString) => Array<string | ModelToValue>,
                                       wrapped: WrappedDynamicValueString): ModelToString {
  const parts = getMappedArray(wrapped);
  return (model: object) => {
    return joinAsString(parts, model);
  };
}
