import { isNumeric, Value } from '../../../../core';
import { regex } from '../../../types-and-interfaces/html-parser/regex';
import { getModel } from '../../get-model';

export function parseValueMapParameter(model: Value, param: string): Value | undefined {
  if (regex.quotedString.test(param)) {
    return param.slice(1, -1);
  }
  const modelValue: Value | undefined = getModel(model, param);
  if (modelValue !== undefined) {
    return modelValue;
  }
  if (isNumeric(param)) {
    return parseFloat(param);
  }
  if (param === 'false') {
    return false;
  }
  if (param === 'true') {
    return true;
  }
  return undefined;
}
