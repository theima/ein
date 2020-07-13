import { isNumeric, Value } from '../../../core';
import { getModel } from '../../../view/functions/get-model';

export function parseValueMapParameter(model: Value, param: string): Value | undefined {
  let matcher: RegExp = /^(["']).*\1$/;
  if (matcher.test(param)) {
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
