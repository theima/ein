import { ElementData, ModelMap, ModelToElement, NodeElementData, TemplateElement } from '../..';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { applyModifiers } from '../apply-modifiers';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { isSlot } from '../type-guards/is-slot';
import { NodeAsync } from '../../../node-async';

export function childElementMap(elementMap: (node: NodeAsync<object>,
                                             templateElement: TemplateElement,
                                             elementData: ElementData | null,
                                             modelMap: ModelMap) => ModelToElement,
                                getNode: (templateElement: TemplateElement,
                                          elementData: ElementData | NodeElementData | null) => NodeAsync<object>,
                                getElement: (name: string) => ElementData | null,
                                templateElement: TemplateElement | ModelToString | FilledSlot) {
  const apply: (e: TemplateElement) => ModelToElementOrNull | ModelToElements = (childElement: TemplateElement) => {
    const childData: ElementData | null = getElement(childElement.name);
    return applyModifiers(elementMap, getNode, apply, childElement, childData);
  };
  const contentMap: (e: TemplateElement | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot =
    (templateElement: TemplateElement | ModelToString | FilledSlot) => {
      if (typeof templateElement === 'function') {
        return templateElement;
      }
      if (isSlot(templateElement)) {
        const slot: MappedSlot = {slot: true, mappedSlot: true};
        if (templateElement.content) {
          slot.content = templateElement.content.map(contentMap);
          slot.mappedFor = templateElement.filledFor;
        }
        return slot;
      }
      return apply(templateElement);
    };
  return contentMap(templateElement);
}
