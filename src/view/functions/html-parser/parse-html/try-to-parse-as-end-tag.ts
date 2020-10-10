import { regex } from '../../../types-and-interfaces/html-parser/regex';

export function tryToParseAsEndTag(html: string): [boolean, string, string?] {
  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  const match: RegExpMatchArray | null = html.match(regex.endTag);
  if (match) {
    const tag = match[0];
    const tagName = match[1];
    return [true, html.substring(tag.length), tagName.toLowerCase()];
  }
  return [false, html];
}
