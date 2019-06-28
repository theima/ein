import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { Slot } from '../types-and-interfaces/slots/slot';
import { isSlot } from './type-guards/is-slot';
import { ElementTemplate } from '..';
import { FilledSlot } from '../types-and-interfaces/slots/filled.slot';
import { FilledElementTemplate } from '../types-and-interfaces/templates/filled.element-template';
import { isElementTemplate } from './type-guards/is-element-template';

export function fillSlots(id: string, viewContent: Array<ElementTemplate | ModelToString | Slot>,
                          insertedContent: Array<FilledElementTemplate | ModelToString | FilledSlot>): Array<FilledElementTemplate | ModelToString | FilledSlot> {
  const insertInList = (list: Array<ElementTemplate | ModelToString | Slot>) => {
    let found = false;
    const newList = list.reduce(
      (items: Array<ElementTemplate | ModelToString | Slot>, t) => {
        if (isSlot(t)) {
          const filled: FilledSlot = {
            filledSlot: true,
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
      }, []) as Array<FilledElementTemplate | ModelToString | FilledSlot>;
    return found ? newList : list as Array<ElementTemplate | ModelToString | FilledSlot>;
  };
  const insert = (list: Array<ElementTemplate | ModelToString | Slot>) => {
    const verifiedList = insertInList(list);
    return verifiedList.map(
      (item) => {
        if (isElementTemplate(item)) {
          const newList: Array<FilledElementTemplate | ModelToString | FilledSlot> = insert(item.content || []);
          if (newList !== item.content) {
            const filled: FilledElementTemplate = { ...item, content: newList };
            return filled;
          }
        }
        return item;
      }
    ) as Array<FilledElementTemplate | ModelToString | FilledSlot>;
  };
  let result: Array<FilledElementTemplate | ModelToString | FilledSlot> = insert(viewContent);
  if (insertedContent.length) {
    result.push({
      filledSlot: true,
      slot: true,
      filledFor: id,
      content: insertedContent
    });
  }
  return result;

}
