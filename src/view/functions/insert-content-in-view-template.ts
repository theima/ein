import { RenderData } from '..';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { BuiltIn } from '../../html-template/types-and-interfaces/built-in';

export function insertContentInViewTemplate(template: Array<RenderData | ModelToString>, content: Array<RenderData | ModelToString>): Array<RenderData | ModelToString> {
  const insertInList = (list: Array<RenderData | ModelToString>) => {
    let found = false;
    const newList = list.reduce(
      (items: Array<RenderData | ModelToString>, t) => {
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
  const insert = (list: Array<RenderData | ModelToString>) => {
    list = insertInList(list);
    return list.map(
      (item) => {
        if (typeof item === 'object') {
          const newList: Array<RenderData | ModelToString> = insert(item.content || []);
          if (newList !== item.content) {
            return {...item, content: newList};
          }
        }
        return item;
      }
    );
  };
  let result = insert(template);
  return result.concat(content);

}
