import { TemplateString } from '../types-and-interfaces/template-string';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { partsToString } from './parts-to-string';

export function valueMap(getParts: (templateString: TemplateString) => Array<string | ModelToValue>,
                         templateString: TemplateString): ModelToValue {
  const parts = getParts(templateString);
  let single: ModelToValue;
  if (parts.length === 1) {
    const part = parts[0];
    if (typeof part === 'function') {
      single = part;
    }
  }
  return (model: object) => {
    if (single) {
      return single(model);
    }
    return partsToString(parts, model);
  };
}
