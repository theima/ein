import { isNumeric } from '../../../core';
import { getModel } from '../../../view/functions/get-model';
import { Value } from '../../../core/types-and-interfaces/value/value';

export function parseValueMapParameter(model: Value, param: string): Value | null {
  let matcher: RegExp = /^(["']).*\1$/;
  if (matcher.test(param)) {
    return param.slice(1, -1);
  }
  const modelValue: Value | null = getModel(model, param);
  if (modelValue !== null) {
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
  return null;
}
