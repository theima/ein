import { HtmlString } from '../../../types-and-interfaces/html-parser/html-string';

export function tryToParseAsComment(html: string): [boolean, string] {
  const index: number = html.indexOf(HtmlString.EndComment);
  if (index >= 0) {
    return [true, html.substring(index + 3)];
  }
  return [false, html];
}
