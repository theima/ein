import { ModelToValue } from '../../../../core/types-and-interfaces/model-to-value';
import { DynamicPart } from '../../../types-and-interfaces/html-parser/dynamic-part';
import { DynamicString } from '../../../types-and-interfaces/html-parser/dynamic-string';

export function createParts(toValue: (dynamicString: DynamicPart) => ModelToValue,
                            dynamicString: DynamicString): Array<string | ModelToValue> {
  const matcher: RegExp = /{{(\s*[\w\.:=>'"\s]+\s*)}}/;
  let parts: Array<string | ModelToValue> = [];
  let match = matcher.exec(dynamicString);
  while (match) {
    if (match.index > 0) {
      parts.push(dynamicString.substring(0, match.index));
    }
    parts.push(toValue(match[1]));
    dynamicString = dynamicString.substring(match.index + match[0].length);
    match = matcher.exec(dynamicString);
  }
  if (dynamicString.length) {
    parts.push(dynamicString);
  }
  return parts;
}
