import { regex } from '../../../types-and-interfaces/html-parser/regex';
import { htmlElements } from './html-elements';

export function tryToParseAsStartTag(html: string): [boolean, string, [string, string, boolean]?] {
  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  const match: RegExpMatchArray | null = html.match(regex.startTag);
  if (match) {
    const tag = match[0];
    const tagName = match[1].toLowerCase();
    const rest = match[2];
    const unary = !!match[3];
    if (htmlElements.special[tagName]) {
      const endTag = `</${tagName}>`;
      const index = html.indexOf(endTag);
      if (index >= 0) {
        return [true, html.substring(index + endTag.length)];
      }
    }
    return [true, html.substring(tag.length), [tagName.toLowerCase(), rest, unary]];
  }
  return [false, html];
}
