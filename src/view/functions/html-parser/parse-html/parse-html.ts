import { ModelToString, Stack } from '../../../../core';
import { DynamicProperty } from '../../../types-and-interfaces/element-template/dynamic-property';
import { ElementTemplate } from '../../../types-and-interfaces/element-template/element-template';
import { ElementTemplateContent } from '../../../types-and-interfaces/element-template/element-template-content';
import { Property } from '../../../types-and-interfaces/element-template/property';
import { DynamicString } from '../../../types-and-interfaces/html-parser/dynamic-string';
import { HTMLAttribute } from '../../../types-and-interfaces/html-parser/html-attribute';
import { regex } from '../../../types-and-interfaces/html-parser/regex';
import { htmlElements } from './html-elements';

export function parseHTML(toString: (dynamicString: DynamicString) => ModelToString | string,
                          toProperty: (a: HTMLAttribute) => Property | DynamicProperty,
                          html: string): ElementTemplateContent[] {
  let result: ElementTemplateContent[] = [];
  let elementStack: Stack<ElementTemplate> = new Stack();
  const addContent = (content: ElementTemplate | DynamicString) => {
    const activeElement = elementStack.peek();
    const mapped = typeof content === 'string' ? toString(content) : content;
    if (activeElement) {
      activeElement.content.push(mapped);
    } else {
      result.push(mapped);
    }
  };
  const createElement: (name: string, attributes: HTMLAttribute[]) => ElementTemplate = (name, attributes) => {
    return {
      name,
      content: [],
      properties: attributes.map(toProperty)
    };
  };
  const elementOpened = (tag: string, attributes: HTMLAttribute[], unary: boolean) => {
    const element = createElement(tag, attributes);

    addContent(element);
    if (!unary) {
      elementStack.push(element);
    }
  };
  const elementClosed = (tag: string) => {
    elementStack.pop();
  };
  const textEncountered = (text: string) => {
    if (text.length) {
      addContent(text);
    }
  };

  let tagStack: Stack<string> = new Stack();
  let last = html;

  const parseStartTag = (tag: string, tagName: string, rest: string, unary: string) => {
    if (htmlElements.block[tagName]) {
      const current = tagStack.peek();
      while (current && htmlElements.inline[current]) {
        parseEndTag('', current);
      }
    }
    if (htmlElements.closeSelf[tagName] && tagStack.peek() === tagName) {
      parseEndTag('', tagName);
    }

    const isUnary: boolean = htmlElements.empty[tagName] || !!unary;

    if (!isUnary) {
      tagStack.push(tagName);
    }
    let attrs: HTMLAttribute[] = [];
    rest.replace(regex.attr, function(match, name) {
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
    elementOpened(tagName, attrs, isUnary);
  };

  const parseEndTag = (tag?: string, tagName?: string) => {
    for (let i = tagStack.count - 1; i >= 0; i--) {
      if (tagName) {
        tagName = tagName.toLowerCase();
      }
      const tag = tagStack.pop() as string;
      elementClosed(tag);
      if (tag.toLowerCase() === tagName) {
        break;
      }
    }
  };

  let index: number;

  let match: RegExpMatchArray | null;
  while (html) {
    let chars: boolean = true;

    // Make sure we're not in a script or style element
    const current = tagStack.peek();
    if (!current || !htmlElements.special[current]) {

      // Comment
      if (html.indexOf('<!--') === 0) {
        index = html.indexOf('-->');

        if (index >= 0) {
          html = html.substring(index + 3);
          chars = false;
        }

        // end tag
      } else if (html.indexOf('</') === 0) {
        match = html.match(regex.endTag);

        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(regex.endTag, parseEndTag as any);
          chars = false;
        }

        // start tag
      } else if (html.indexOf('<') === 0) {
        match = html.match(regex.startTag);

        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(regex.startTag, parseStartTag as any);
          chars = false;
        }
      }

      if (chars) {
        index = html.indexOf('<');

        let text = index < 0 ? html : html.substring(0, index);
        html = index < 0 ? '' : html.substring(index);
        textEncountered(text);
      }

    } else {
      html = html.replace(new RegExp('(.*)<\/' + current + '[^>]*>'), function(all, text) {
        text = text.replace(/<!--(.*?)-->/g, '$1')
          .replace(/<!\[CDATA\[(.*?)]]>/g, '$1');

        textEncountered(text);

        return '';
      });
      parseEndTag('', current);
    }

    if (html === last) {
      throw new Error('Parse Error: ' + html);
    }
    last = html;
  }
  // Clean up any remaining tags
  parseEndTag();
  return result;
}