import { ModelToString } from '../types-and-interfaces/model-to-string';
import { Slot } from '../types-and-interfaces/slots/slot';
import { isSlot } from './type-guards/is-slot';
import { TemplateElement } from '..';
import { FilledSlot } from '../types-and-interfaces/slots/filled.slot';
import { FilledTemplateElement } from '../types-and-interfaces/templates/filled.template-element';
import { isTemplateElement } from './type-guards/is-template-element';

export function fillSlots(id: string, viewContent: Array<TemplateElement | ModelToString | Slot>,
                          insertedContent: Array<FilledTemplateElement | ModelToString | FilledSlot>): Array<FilledTemplateElement | ModelToString | FilledSlot> {
  const insertInList = (list: Array<TemplateElement | ModelToString | Slot>) => {
    let found = false;
    const newList = list.reduce(
      (items: Array<TemplateElement | ModelToString | Slot>, t) => {
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
      }, []) as Array<FilledTemplateElement | ModelToString | FilledSlot>;
    return found ? newList : list as Array<TemplateElement | ModelToString | FilledSlot>;
  };
  const insert = (list: Array<TemplateElement | ModelToString | Slot>) => {
    const verifiedList = insertInList(list);
    return verifiedList.map(
      (item) => {
        if (isTemplateElement(item)) {
          const newList: Array<FilledTemplateElement | ModelToString | FilledSlot> = insert(item.content || []);
          if (newList !== item.content) {
            const filled: FilledTemplateElement = { ...item, content: newList };
            return filled;
          }
        }
        return item;
      }
    ) as Array<FilledTemplateElement | ModelToString | FilledSlot>;
  };
  let result: Array<FilledTemplateElement | ModelToString | FilledSlot> = insert(viewContent);
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
