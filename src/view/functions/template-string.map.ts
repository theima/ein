import { TemplateString } from '../../html-template/types-and-interfaces/template-string';
import { Template } from '../types-and-interfaces/template';

export function templateStringMap(templateMap: (template: Template) => (model: object) => string,
                                  templateString: TemplateString): (model: object) => string {
  const matcher: RegExp = /{{(\s*[\w\.:=>'"\s]+\s*)}}/;
  let parts: Array<string | ((m: object) => string)> = [];
  let match = matcher.exec(templateString);
  while (match) {
    if (match.index > 0) {
      parts.push(templateString.substring(0, match.index));
    }
    parts.push(templateMap(match[1]));
    templateString = templateString.substring(match.index + match[0].length);
    match = matcher.exec(templateString);
  }
  parts.push(templateString);
  return (model: object) => {
    return parts.reduce((rendered: string, part: string | ((m: object) => string)) => {
      if (typeof part !== 'string') {
        part = part(model);
      }
      return rendered + part;
    }, '');
  };
}
