import { ModelToValue } from '../../../core/types-and-interfaces/model-to-value';

export function joinAsString(parts: Array<string | ModelToValue>, model: object): string {
  return parts.reduce((rendered: string, part: string | ModelToValue) => {
    if (typeof part !== 'string') {
      return rendered + part(model);
    }
    return rendered + part;
  }, '');
}
