import { Stack } from '../../core/stack';
import { Attribute, TemplateElement, TemplateString } from '..';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { regex } from '../types-and-interfaces/regex';
import { elements } from '../types-and-interfaces/elements';

export function HTMLParser(html: string): Array<TemplateElement | TemplateString> {
  let result: Array<TemplateElement | TemplateString> = [];
  let elementStack: Stack<TemplateElement> = new Stack();
  let results = '';
  const addContent = (content: TemplateElement | string) => {
    const activeElement = elementStack.peek();
    if (activeElement) {
      activeElement.content.push(content);
    } else {
      result.push(content);
    }
  };
  const createElement: (name: string) => TemplateElement = (name) => {
    return {
      name,
      content: [],
      attributes: [],
      dynamicAttributes: []
    };
  };
  const elementOpened = (tag: string, attributes: Attribute[], unary: boolean) => {
    const element = createElement(tag);
    const ifAttribute: Attribute | undefined = attributes.find(
      (a) => a.name === BuiltIn.If
    );
    if (ifAttribute) {
      element.show = ifAttribute.value;
    }

    element.dynamicAttributes = attributes.filter(
      (attr) => {
        return attr.name.indexOf(BuiltIn.Prefix) === 0 && attr.name !== BuiltIn.If;
      }
    ).map(
      (a) => {
        return {
          name: a.name.substring(2),
          value: a.value
        };
      });
    element.attributes = attributes.filter(
      (attr) => {
        return attr.name.indexOf(BuiltIn.Prefix) !== 0;
      }
    );
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
    tagName = tagName.toLowerCase();
    if (elements.block[tagName]) {
      const current = tagStack.peek();
      while (current && elements.inline[current]) {
        parseEndTag('', current);
      }
    }
    if (elements.closeSelf[tagName] && tagStack.peek() === tagName) {
      parseEndTag('', tagName);
    }

    const isUnary: boolean = elements.empty[tagName] || !!unary;

    if (!isUnary) {
      tagStack.push(tagName);
    }
    let attrs: Attribute[] = [];

    rest.replace(regex.attr, function(match, name) {
      const value = arguments[2] ? arguments[2] :
        arguments[3] ? arguments[3] :
          arguments[4] ? arguments[4] :
            elements.fillAttrs[name] ? name : '';

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
      const tag = tagStack.pop() as string;
      elementClosed(tag);
      if (tag === tagName) {
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
    if (!current || !elements.special[current]) {

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
  result.push(results);
  return result;
}
