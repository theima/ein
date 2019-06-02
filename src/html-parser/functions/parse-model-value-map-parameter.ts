import { isNumeric } from '../../core';
import { getModel } from '../../view/functions/get-model';

export function parseModelValueMapParameter(model: object, param: string): string | number | boolean | null {
  let matcher: RegExp = /^(["']).*\1$/;
  if (matcher.test(param)) {
    return param.slice(1, -1);
  }
  const modelValue: string | number | boolean | null = getModel(model, param);
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
