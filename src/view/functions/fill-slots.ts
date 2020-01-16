import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ElementTemplate } from '..';
import { Value } from '../../core';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../node-async';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { Element } from '../types-and-interfaces/elements/element';
import { ModelToElement } from '../types-and-interfaces/elements/model-to-element';
import { Property } from '../types-and-interfaces/property';
import { ViewTemplate } from '../types-and-interfaces/view-templates/view-template';
import { elementMap } from './element-map/element.map';
import { isElementTemplate } from './type-guards/is-element-template';

export function fillSlots(id: string,
                          usedViews: string[],
                          getId: () => string,
                          getViewTemplate: (name: string) => ViewTemplate | null,
                          node: NodeAsync<Value>,
                          viewTemplate: ViewTemplate,
                          insertedContent: Array<ElementTemplate | ModelToString>): ViewTemplate {
  const viewTemplateContent: Array<ElementTemplate | ModelToString> = viewTemplate.children;
  let validContent: ElementTemplate[] = insertedContent.filter((e) => {
    return isElementTemplate(e);
  }) as any;
  const slotStream = node as any;
  const fillSlot = (slot: ElementTemplate) => {
    const tempFirstElement = validContent[0];
    if (tempFirstElement) {
      const modelToElement = elementMap(usedViews, getId, getViewTemplate, id, node, tempFirstElement as any) as ModelToElement;
      const viewMap = (m: Value) => {
        return modelToElement(m);
      };
      const elementStream: Observable<Element> = slotStream.pipe(map(viewMap));
      validContent = [];
      let properties: Property[] = [];
      if (isElementTemplate(tempFirstElement)) {
        properties = tempFirstElement.properties;
      }
      properties = properties.concat([{ name: BuiltIn.ElementStream, value: elementStream }]);
      const slottedElement: ElementTemplate = { ...tempFirstElement, content: [], properties} as any;
      return slottedElement;
    }
    return (m: any) => '';
  };

  const fillSlotInContent = (list: Array<ElementTemplate | ModelToString>) => {
    let found = false;
    const filledList = list.map((t: ElementTemplate | ModelToString) => {
      if (isElementTemplate(t) && t.name === BuiltIn.Slot) {
        found = true;
        return fillSlot(t);
      }
      return t;

    });
    return found ? filledList : list as Array<ElementTemplate | ModelToString>;
  };
  const insert = (list: Array<ElementTemplate | ModelToString>) => {
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
  const updateSlot = (m: Value) => {
  };
  const properties = viewTemplate.properties.concat([{ name: BuiltIn.SendToSlot, value: updateSlot }]);
  return { ...viewTemplate, children: result, properties };

}
