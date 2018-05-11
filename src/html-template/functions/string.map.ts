import { TemplateString } from '../types-and-interfaces/template-string';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { partsToString } from './parts-to-string';

export function stringMap(getParts: (templateString: TemplateString) => Array<string | ModelToValue>,
                          templateString: TemplateString): ModelToString {
  const parts = getParts(templateString);
  return (model: object) => {
    return partsToString(parts, model);
  };
}
