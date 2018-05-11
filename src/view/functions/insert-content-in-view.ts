import { TemplateElement } from '../../html-template/index';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { InsertContentAt } from '../types-and-interfaces/insert-content-at';
import { isInsertContentAt } from './is-insert-content-at';

export function insertContentInView(view: Array<TemplateElement | ModelToString | InsertContentAt>, content: Array<TemplateElement | ModelToString>): Array<TemplateElement | ModelToString> {
  const insertInList = (list: Array<TemplateElement | ModelToString | InsertContentAt>) => {
      let found = false;
      const newList = list.reduce(
        (items: Array<TemplateElement | ModelToString | InsertContentAt>, t) => {
          if (isInsertContentAt(t)) {
            items = items.concat(content);
            content = [];
            found = true;
          } else {
            items.push(t);
          }
          return items;
        }, []) as Array<TemplateElement | ModelToString>;
      return found ? newList : list as Array<TemplateElement | ModelToString>;
    };
  const insert = (list: Array<TemplateElement | ModelToString | InsertContentAt>) => {
    const verifiedList = insertInList(list);
    return verifiedList.map(
      (item) => {
        if (typeof item === 'object' && !isInsertContentAt(item)) {
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
