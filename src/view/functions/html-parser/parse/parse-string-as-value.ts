import { isNumeric } from '../../../../core';

export function parseStringAsValue(s: string): string | boolean | number {
  if (isNumeric(s)) {
    return parseFloat(s);
  }
  if (s === 'false') {
    return false;
  }
  if (s === 'true') {
    return true;
  }
  return s;
}
