import { ViewData } from '../../view/index';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { TemplateString } from '../types-and-interfaces/template-string';
import { BuiltIn } from '../types-and-interfaces/built-in';

export function insertContentInViewContent(view: ViewData, content: Array<TemplateElement | TemplateString>): Array<TemplateElement | TemplateString> {
  const insertInList = (list: Array<TemplateElement | TemplateString>) => {
    let found = false;
    const newList = list.reduce(
      (items: Array<TemplateElement | TemplateString>, t) => {
        if (typeof t !== 'string' && t.name === BuiltIn.Content) {
          items = items.concat(content);
          content = [];
          found = true;
        } else {
          items.push(t);
        }
        return items;
      }, []);
    return found ? newList : list;
  };
  const insert = (list: Array<TemplateElement | TemplateString>) => {
    list = insertInList(list);
    return list.map(
      (t) => {
        if (typeof t !== 'string') {
          const newList: Array<TemplateElement | TemplateString> = insert(t.content);
          if (newList !== t.content) {
            return {...t, content: newList};
          }
        }
        return t;
      }
    );
  };
  let result = insert(view.content);
  return result.concat(content);

}
