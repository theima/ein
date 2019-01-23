import { ModelToString } from '../types-and-interfaces/model-to-string';
import { Slot } from '../types-and-interfaces/slots/slot';
import { isSlot } from './type-guards/is-slot';
import { TemplateElement } from '..';
import { FilledSlot } from '../types-and-interfaces/slots/filled.slot';

export function insertContentInView(id: string, view: Array<TemplateElement | ModelToString | Slot>,
                                    insertedContent: Array<TemplateElement | ModelToString | FilledSlot>): Array<TemplateElement | ModelToString | FilledSlot> {
  const insertInList = (list: Array<TemplateElement | ModelToString | Slot>) => {
    let found = false;
    const newList = list.reduce(
      (items: Array<TemplateElement | ModelToString | Slot>, t) => {
        if (isSlot(t)) {
          const filled: FilledSlot = {
            slot: true,
            filledFor: id,
            content: insertedContent
          };
          items.push(filled);
          insertedContent = [];
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
  let result: Array<TemplateElement | ModelToString | FilledSlot> = insert(view);
  if (insertedContent.length) {
    result.push({
      slot: true,
      filledFor: id,
      content: insertedContent
    });
  }
  return result;

}
