import { BuiltIn } from '../types-and-interfaces/built-in';
import { TemplateElement, TemplateString } from '..';

export function insertContentInView(view: Array<TemplateElement | TemplateString>, content: Array<TemplateElement | TemplateString>): Array<TemplateElement | TemplateString> {
  const insertInList = (list: Array<TemplateElement | TemplateString>) => {
    let found = false;
    const newList = list.reduce(
      (items: Array<TemplateElement | TemplateString>, t) => {
        if (typeof t === 'object' && t.name === BuiltIn.Content) {
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
      (item) => {
        if (typeof item === 'object') {
          const newList: Array<TemplateElement | TemplateString> = insert(item.content || []);
          if (newList !== item.content) {
            return {...item, content: newList};
          }
        }
        return item;
      }
    );
  };
  let result = insert(view);
  return result.concat(content);

}
