import { ModelToString, Stack } from '../../../../core';
import { isString } from '../../../../core/functions/type-guards/is-string';
import { ElementTemplate } from '../../../types-and-interfaces/element-template/element-template';
import { ElementTemplateContent } from '../../../types-and-interfaces/element-template/element-template-content';
import { DynamicString } from '../../../types-and-interfaces/html-parser/dynamic-string';
import { HTMLAttribute } from '../../../types-and-interfaces/html-parser/html-attribute';
import { HtmlString } from '../../../types-and-interfaces/html-parser/html-string';
import { htmlElements } from './html-elements';
import { restToAttributes } from './rest-to-attributes';
import { tryToParseAsComment } from './try-to-parse-as-comment';
import { tryToParseAsEndTag } from './try-to-parse-as-end-tag';
import { tryToParseAsStartTag } from './try-to-parse-as-start-tag';

export function parseHTML(
  toString: (dynamicString: DynamicString) => ModelToString | string,
  createElement: (name: string, attributes: HTMLAttribute[]) => ElementTemplate,
  html: string
): ElementTemplateContent[] {
  const result: ElementTemplateContent[] = [];
  const elementStack: Stack<ElementTemplate> = new Stack();
  const tagStack: Stack<string> = new Stack();
  const addContent = (content: ElementTemplate | DynamicString | string) => {
    const activeElement = elementStack.peek();
    const mapped = isString(content) ? toString(content) : content;
    if (activeElement) {
      activeElement.content.push(mapped);
    } else {
      result.push(mapped);
    }
  };

  const elementOpened = (tag: string, attributes: HTMLAttribute[], unary: boolean) => {
    const element = createElement(tag, attributes);
    addContent(element);
    if (!unary) {
      elementStack.push(element);
    }
  };
  const handleStartTag = (tagName: string, rest: string, selfClosing: boolean) => {
    if (htmlElements.block[tagName]) {
      const current = tagStack.peek();
      while (current && htmlElements.inline[current]) {
        handleEndTag(current);
      }
    }
    if (htmlElements.closeSelf[tagName] && tagStack.peek() === tagName) {
      handleEndTag(tagName);
    }
    const isUnary: boolean = htmlElements.empty[tagName] || selfClosing;
    if (!isUnary) {
      tagStack.push(tagName);
    }

    elementOpened(tagName, restToAttributes(rest), isUnary);
  };

  const handleEndTag = (tagName?: string) => {
    for (let i = tagStack.count - 1; i >= 0; i--) {
      const tag = tagStack.pop() as string;
      elementStack.pop();
      if (tag === tagName) {
        break;
      }
    }
  };

  let htmlBeforeParseAttempt = html;
  while (html) {
    let handled: boolean = false;
    if (html.indexOf(HtmlString.StartComment) === 0) {
      [handled, html] = tryToParseAsComment(html);
    } else if (html.indexOf(HtmlString.EndTag) === 0) {
      let match;
      [handled, html, match] = tryToParseAsEndTag(html);
      if (match) {
        handleEndTag(match);
      }
    } else if (html.indexOf(HtmlString.StartTag) === 0) {
      let match;
      [handled, html, match] = tryToParseAsStartTag(html);
      if (match) {
        handleStartTag(...match);
      }
    }
    if (!handled) {
      const index: number = html.indexOf(HtmlString.StartTag);
      if (index < 0) {
        html = '';
      } else {
        const text = html.substring(0, index);
        html = html.substring(index);
        addContent(text);
      }
    }
    if (html === htmlBeforeParseAttempt) {
      throw new Error('Parse Error: ' + html);
    }
    htmlBeforeParseAttempt = html;
  }
  // Clean up any remaining tags
  handleEndTag();
  return result;
}
