
import { ElementTemplate } from '..';
import { Value } from '../../core';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../node-async';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { Property } from '../types-and-interfaces/property';
import { ElementTemplateContent } from '../types-and-interfaces/templates/element-template-content';
import { ViewTemplate } from '../types-and-interfaces/view-templates/view-template';
import { isElementTemplate } from './type-guards/is-element-template';

export function fillSlots(node: NodeAsync<Value>,
                          viewTemplate: ViewTemplate,
                          insertedContent: ElementTemplateContent[]): ViewTemplate {
  const viewTemplateContent: ElementTemplateContent[] = viewTemplate.content;
  let validContent: ElementTemplate[] = insertedContent.filter((e) => {
    return isElementTemplate(e);
  }) as any;
  const fillSlot = (slot: ElementTemplate) => {
    const tempFirstElement = validContent[0];
    if (tempFirstElement && isElementTemplate(tempFirstElement)) {
      let properties: Property[] = tempFirstElement.properties;
      const slotStream = node;
      properties = properties.concat([{ name: BuiltIn.SlotContent, value: tempFirstElement }, { name: BuiltIn.SlotNode, value: slotStream }]);
      const slottedElement: ElementTemplate = { ...tempFirstElement, content: [], properties } as any;
      validContent = [];
      return slottedElement;
    }
    return (m: any) => '';
  };

  const fillSlotInContent = (list: ElementTemplateContent[]) => {
    let found = false;
    const filledList = list.map((t: ElementTemplateContent) => {
      if (isElementTemplate(t) && t.name === BuiltIn.Slot) {
        found = true;
        return fillSlot(t);
      }
      return t;

    });
    return found ? filledList : list as Array<ElementTemplate | ModelToString>;
  };
  const insert = (list: ElementTemplateContent[]) => {
    const filledList = fillSlotInContent(list);
    return filledList.map((item) => {
      if (isElementTemplate(item)) {
        const newList: Array<ElementTemplate | ModelToString> = insert(item.content || []);
        if (newList !== item.content) {
          const filled: ElementTemplate = { ...item, content: newList };
          return filled;
        }
      }
      return item;
    }
    ) as Array<ElementTemplate | ModelToString>;
  };
  let result: Array<ElementTemplate | ModelToString> = insert(viewTemplateContent);
  if (validContent.length) {
    const a = fillSlot({
    } as any);
    result.push(a);
  }
  return { ...viewTemplate, content: result };

}
