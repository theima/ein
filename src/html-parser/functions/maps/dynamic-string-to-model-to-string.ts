import { dynamicString } from '../../types-and-interfaces/dynamic-string';
import { ModelToString } from '../../../view/types-and-interfaces/model-to-string';
import { ModelToValue } from '../../../view/types-and-interfaces/model-to-value';
import { joinAsString } from './join-as-string';

export function dynamicStringToModelToString(getMappedArray: (dynamic: dynamicString) => Array<string | ModelToValue>,
                                             dynamic: dynamicString): ModelToString {
  const parts = getMappedArray(dynamic);
  return (model: object) => {
    return joinAsString(parts, model);
  };
}
