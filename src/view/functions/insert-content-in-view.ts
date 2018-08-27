import { ModelToString } from '../types-and-interfaces/model-to-string';
import { Slot } from '../types-and-interfaces/slot';
import { isSlot } from './is-slot';
import { TemplateElement } from '..';

export function insertContentInView(view: Array<TemplateElement | ModelToString | Slot>, content: Array<TemplateElement | ModelToString>): Array<TemplateElement | ModelToString> {
  const insertInList = (list: Array<TemplateElement | ModelToString | Slot>) => {
      let found = false;
      const newList = list.reduce(
        (items: Array<TemplateElement | ModelToString | Slot>, t) => {
          if (isSlot(t)) {
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
  const insert = (list: Array<TemplateElement | ModelToString | Slot>) => {
    const verifiedList = insertInList(list);
    return verifiedList.map(
      (item) => {
        if (typeof item === 'object' && !isSlot(item)) {
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
