import { dynamicString } from '../..';
import { DynamicStringValue } from '../../types-and-interfaces/dynamic-string-value';
import { ModelToValue } from '../../../core/types-and-interfaces/model-to-value';

export function dynamicStringToMappedArray(map: (dynamicString: DynamicStringValue) => ModelToValue,
                                           dynamicString: dynamicString): Array<string | ModelToValue> {
  const matcher: RegExp = /{{(\s*[\w\.:=>'"\s]+\s*)}}/;
  let parts: Array<string | ModelToValue> = [];
  let match = matcher.exec(dynamicString);
  while (match) {
    if (match.index > 0) {
      parts.push(dynamicString.substring(0, match.index));
    }
    parts.push(map(match[1]));
    dynamicString = dynamicString.substring(match.index + match[0].length);
    match = matcher.exec(dynamicString);
  }
  if (dynamicString.length) {
    parts.push(dynamicString);
  }
  return parts;
}
