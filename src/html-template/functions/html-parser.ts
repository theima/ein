import { makeMap } from './make-map';
import { Stack } from '../../core/stack';
import { Attribute, TemplateElement, TemplateString } from '..';
import { BuiltIn } from '../types-and-interfaces/built-in';
// Regular Expressions for parsing tags and attributes
const startTag = /^<([-A-Za-z0-9_]+)((?:\s+\w+-?\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
const endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
const attr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

// Empty Elements - HTML 4.01
const empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed');

// Block Elements - HTML 4.01
const block = makeMap('address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul');

// Inline Elements - HTML 4.01
const inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
const closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

// Attributes that have their values filled in disabled="disabled"
const fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

// Special Elements (can contain anything)
const special = makeMap('script,style');

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
    if(ifAttribute) {
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
        return attr.name.indexOf(BuiltIn.Prefix) !== 0 ;
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
    addContent(text);
  };

  let tagStack: Stack<string> = new Stack();
  let last = html;

  const parseStartTag = (tag: string, tagName: string, rest: string, unary: string) => {
    tagName = tagName.toLowerCase();
    if (block[tagName]) {
      const current = tagStack.peek();
      while (current && inline[current]) {
        parseEndTag('', current);
      }
    }
    if (closeSelf[tagName] && tagStack.peek() === tagName) {
      parseEndTag('', tagName);
    }

    const isUnary: boolean = empty[tagName] || !!unary;

    if (!isUnary) {
      tagStack.push(tagName);
    }
    let attrs: Attribute[] = [];

    rest.replace(attr, function(match, name) {
      const value = arguments[2] ? arguments[2] :
        arguments[3] ? arguments[3] :
          arguments[4] ? arguments[4] :
            fillAttrs[name] ? name : '';

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
    if (!current || !special[current]) {

      // Comment
      if (html.indexOf('<!--') === 0) {
        index = html.indexOf('-->');

        if (index >= 0) {
          html = html.substring(index + 3);
          chars = false;
        }

        // end tag
      } else if (html.indexOf('</') === 0) {
        match = html.match(endTag);

        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(endTag, parseEndTag as any);
          chars = false;
        }

        // start tag
      } else if (html.indexOf('<') === 0) {
        match = html.match(startTag);

        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(startTag, parseStartTag as any);
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
