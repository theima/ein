import { TemplateString } from '..';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { Template } from '../types-and-interfaces/template';

export function getTemplateStringParts(templateMap: (template: Template) => ModelToValue,
                                       templateString: TemplateString): Array<string | ModelToValue> {
  const matcher: RegExp = /{{(\s*[\w\.:=>'"\s]+\s*)}}/;
  let parts: Array<string | ModelToValue> = [];
  let match = matcher.exec(templateString);
  while (match) {
    if (match.index > 0) {
      parts.push(templateString.substring(0, match.index));
    }
    parts.push(templateMap(match[1]));
    templateString = templateString.substring(match.index + match[0].length);
    match = matcher.exec(templateString);
  }
  if (templateString.length) {
    parts.push(templateString);
  }
  return parts;
}
