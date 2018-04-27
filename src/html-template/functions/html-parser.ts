import { makeMap } from './make-map';
//tslint:disable
// Regular Expressions for parsing tags and attributes
var startTag = /^<([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
  endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
  attr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

// Empty Elements - HTML 4.01
var empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed');

// Block Elements - HTML 4.01
var block = makeMap('address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul');

// Inline Elements - HTML 4.01
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

// Special Elements (can contain anything)
var special = makeMap('script,style');

export function HTMLParser(html: string) {
  interface Attr {
    name: string;
    value: string;
    escaped: string;
  }

  var results = '';
  let handler = {
    start: function (tag: string, attrs: Attr[], unary: boolean) {
      results += '<' + tag;

      for (var i = 0; i < attrs.length; i++)
        results += ' ' + attrs[i].name + '="' + attrs[i].escaped + '"';

      results += (unary ? '/' : '') + '>';
    },
    end: function (tag: string) {
      results += '</' + tag + '>';
    },
    chars: function (text: string) {
      results += text;
    }
  };
  let stack: any = [];
  stack.last = function () {
    return this[this.length - 1];
  };
  let last = html;

  const parseStartTag = (tag: string, tagName: string, rest: string, unary: string) => {
    tagName = tagName.toLowerCase();

    if (block[tagName]) {
      while (stack.last() && inline[stack.last()]) {
        parseEndTag('', stack.last());
      }
    }

    if (closeSelf[tagName] && stack.last() == tagName) {
      parseEndTag('', tagName);
    }

    const isUnary: boolean = empty[tagName] || !!unary;

    if (!isUnary)
      stack.push(tagName);

    if (handler.start) {
      let attrs: Attr[] = [];

      rest.replace(attr, function (match, name) {
        const value = arguments[2] ? arguments[2] :
          arguments[3] ? arguments[3] :
            arguments[4] ? arguments[4] :
              fillAttrs[name] ? name : '';

        attrs.push({
          name: name,
          value: value,
          escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
        });
        return match;
      });

      if (handler.start)
        handler.start(tagName, attrs, isUnary);
    }
  }

  const parseEndTag = (tag?: string, tagName?: string) => {
    let pos = 0;
    if (tagName) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i] == tagName) {
          pos = i;
          break;
        }
      }
    }
    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i: number = stack.length - 1; i >= pos; i--) {
        if (handler.end) {
          handler.end(stack[i]);
        }
      }
      // Remove the open elements from the stack
      stack.length = pos;
    }
  };

  let index: number;

  let match: RegExpMatchArray | null;
  while (html) {
    let chars: boolean = true;

    // Make sure we're not in a script or style element
    if (!stack.last() || !special[stack.last()]) {

      // Comment
      if (html.indexOf('<!--') == 0) {
        index = html.indexOf('-->');

        if (index >= 0) {
          html = html.substring(index + 3);
          chars = false;
        }

        // end tag
      } else if (html.indexOf('</') == 0) {
        match = html.match(endTag);

        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(endTag, parseEndTag as any);
          chars = false;
        }

        // start tag
      } else if (html.indexOf('<') == 0) {
        match = html.match(startTag);

        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(startTag, parseStartTag as any);
          chars = false;
        }
      }

      if (chars) {
        index = html.indexOf('<');

        var text = index < 0 ? html : html.substring(0, index);
        html = index < 0 ? '' : html.substring(index);

        if (handler.chars)
          handler.chars(text);
      }

    } else {
      html = html.replace(new RegExp('(.*)<\/' + stack.last() + '[^>]*>'), function (all, text) {
        text = text.replace(/<!--(.*?)-->/g, '$1')
          .replace(/<!\[CDATA\[(.*?)]]>/g, '$1');

        if (handler.chars)
          handler.chars(text);

        return '';
      });
      parseEndTag('', stack.last());
    }

    if (html == last)
      throw 'Parse Error: ' + html;
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();
  return results;
}



