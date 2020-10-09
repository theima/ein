import { HTMLAttribute } from '../../../types-and-interfaces/html-parser/html-attribute';
import { regex } from '../../../types-and-interfaces/html-parser/regex';
import { htmlElements } from './html-elements';

export function restToAttributes(rest: string): HTMLAttribute[] {
  const attrs: HTMLAttribute[] = [];
  // tslint:disable-next-line: only-arrow-functions
  rest.replace(regex.attr, function (match, name) {
    const value = arguments[2] ? arguments[2] :
      arguments[3] ? arguments[3] :
        arguments[4] ? arguments[4] :
          htmlElements.fillAttrs[name] ? name : '';

    attrs.push({
      name,
      value
    });
    return match;
  });
  return attrs;
}
