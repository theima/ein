import { Dict } from '../../../../core';
import { asNumberIfNumeric } from '../as-number-if-numeric';

export function queryParamsToDict(
  queryParams: string
): Dict<string | number | string[]> {
  if (!queryParams) {
    return {};
  }
  const params: string[] = queryParams.slice(1).split('&');
  return params.reduce(
    (dict: Dict<string | number | string[]>, part: string) => {
      const pair: string[] = part.split('=');
      const key: string = pair[0];
      const value: string = pair[1];
      if (!dict[key]) {
        dict[key] = asNumberIfNumeric(value);
      } else {
        const currentVal: string | number | string[] = dict[key];
        if (Array.isArray(currentVal)) {
          currentVal.push(value);
        } else {
          dict[key] = [String(currentVal), value];
        }
      }

      return dict;
    },
    {}
  );
}
