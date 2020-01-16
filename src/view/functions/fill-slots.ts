import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ElementTemplate } from '..';
import { Value } from '../../core';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../node-async';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { Element } from '../types-and-interfaces/elements/element';
import { ModelToElement } from '../types-and-interfaces/elements/model-to-element';
import { Property } from '../types-and-interfaces/property';
import { FilledSlot } from '../types-and-interfaces/slots/filled.slot';
import { Slot } from '../types-and-interfaces/slots/slot';
import { FilledElementTemplate } from '../types-and-interfaces/templates/filled.element-template';
import { ViewTemplate } from '../types-and-interfaces/view-templates/view-template';
import { elementMap } from './element-map/element.map';
import { isElementTemplate } from './type-guards/is-element-template';
import { isSlot } from './type-guards/is-slot';

export function fillSlots(id: string,
                          usedViews: string[],
                          getId: () => string,
                          getViewTemplate: (name: string) => ViewTemplate | null,
                          node: NodeAsync<Value>,
                          viewTemplate: ViewTemplate,
                          insertedContent: Array<FilledElementTemplate | ModelToString | FilledSlot>): ViewTemplate {
  const viewTemplateContent: Array<ElementTemplate | ModelToString | Slot> = viewTemplate.children;
  let validContent: Array<ElementTemplate | FilledSlot> = insertedContent.filter((e) => {
    return isElementTemplate(e) || isSlot(e);
  }) as any;
  const slotSubject = new ReplaySubject<Value>(1);
  const fillSlot = (slot: Slot) => {
    const tempFirstElement = validContent[0];
    if (tempFirstElement) {
      const modelToElement = elementMap(usedViews, getId, getViewTemplate, id, node, tempFirstElement as any) as ModelToElement;
      const viewMap = (m: Value) => {
        return modelToElement(m, m);
      };
      const elementStream: Observable<Element> = slotSubject.pipe(map(viewMap));
      validContent = [];
      let properties: Property[] = [];
      if (isElementTemplate(tempFirstElement)) {
        properties = tempFirstElement.properties;
      }
      properties = properties.concat([{ name: BuiltIn.ElementStream, value: elementStream }]);
      const slottedElement: FilledElementTemplate = { ...tempFirstElement, content: [], properties} as any;
      return slottedElement;
    }
    return (m: any) => '';
  };

  const fillSlotInContent = (list: Array<ElementTemplate | ModelToString | Slot>) => {
    let found = false;
    const filledList = list.map((t: ElementTemplate | ModelToString | Slot) => {
      if (isSlot(t)) {
        found = true;
        return fillSlot(t);
      }
      return t;

    });
    return found ? filledList : list as Array<ElementTemplate | ModelToString>;
  };
  const insert = (list: Array<ElementTemplate | ModelToString | Slot>) => {
    const filledList = fillSlotInContent(list);
    return filledList.map((item) => {
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
  let result: Array<FilledElementTemplate | ModelToString | FilledSlot> = insert(viewTemplateContent);
  if (validContent.length) {
    const a = fillSlot({
      slot: true
    });
    result.push(a);
  }
  const updateSlot = (m: Value) => {
    slotSubject.next(m);
  };
  const properties = viewTemplate.properties.concat([{ name: BuiltIn.SendToSlot, value: updateSlot }]);
  return { ...viewTemplate, children: result, properties };

}
