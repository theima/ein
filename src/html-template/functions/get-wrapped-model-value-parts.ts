import { WrappedModelValue } from '..';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { ModelValue } from '../types-and-interfaces/model-value';

export function getWrappedModelValueParts(map: (modelValue: ModelValue) => ModelToValue,
                                          wrapped: WrappedModelValue): Array<string | ModelToValue> {
  const matcher: RegExp = /{{(\s*[\w\.:=>'"\s]+\s*)}}/;
  let parts: Array<string | ModelToValue> = [];
  let match = matcher.exec(wrapped);
  while (match) {
    if (match.index > 0) {
      parts.push(wrapped.substring(0, match.index));
    }
    parts.push(map(match[1]));
    wrapped = wrapped.substring(match.index + match[0].length);
    match = matcher.exec(wrapped);
  }
  if (wrapped.length) {
    parts.push(wrapped);
  }
  return parts;
}
