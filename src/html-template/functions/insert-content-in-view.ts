import { BuiltIn } from '../types-and-interfaces/built-in';
import { TemplateElement } from '..';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';

export function insertContentInView(view: Array<TemplateElement | ModelToString>, content: Array<TemplateElement | ModelToString>): Array<TemplateElement | ModelToString> {
  const insertInList = (list: Array<TemplateElement | ModelToString>) => {
    let found = false;
    const newList = list.reduce(
      (items: Array<TemplateElement | ModelToString>, t) => {
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
  const insert = (list: Array<TemplateElement | ModelToString>) => {
    list = insertInList(list);
    return list.map(
      (item) => {
        if (typeof item === 'object') {
          const newList: Array<TemplateElement | ModelToString> = insert(item.content || []);
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
