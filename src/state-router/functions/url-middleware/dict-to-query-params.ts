import { Dict } from '../../../core';

export function dictToQueryParams(dict: Dict<string | number | string []>): string {
  let pairs: string[] = [];
  for (let key in dict) {
    let value = dict[key];
    if (Array.isArray(value)) {
      for (let val of value) {
        pairs.push(key + '=' + val);
      }
    } else {
      pairs.push(key + '=' + value);
    }

  }
  let result: string = pairs.join('&');
  if (result) {
    result = '?' + result;
  }
  return result;
}
