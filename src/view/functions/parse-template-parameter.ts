import {isNumeric} from '../../core/functions/is-numeric';
import {get} from '../../core/functions/get';

export function parseTemplateParameter(model: object, param: string): string | number | boolean | null {
  let matcher: RegExp = /^(["']).*\1$/;
  if (matcher.test(param)) {
    return param.slice(1, -1);
  }
  const modelValue: string | number | boolean = get(model, param);
  if (modelValue) {
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
