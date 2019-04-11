import { ElementData, ModelMap, ModelToElement, TemplateElement } from '../..';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { applyModifiers } from '../apply-modifiers';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { isSlot } from '../type-guards/is-slot';
import { NodeAsync } from '../../../node-async';
import { partial } from '../../../core';
//import { addModifierAttributes } from '../modifiers/add-modifier-attributes';

export function childElementMap(elementMap: (elementData: ElementData | null,
                                             node: NodeAsync<object>,
                                             templateElement: TemplateElement,
                                             modelMap: ModelMap) => ModelToElement,
                                getElement: (name: string) => ElementData | null,
                                node: NodeAsync<object>,
                                templateElement: TemplateElement | ModelToString | FilledSlot) {
  const apply: (e: TemplateElement) => ModelToElementOrNull | ModelToElements = (childElement: TemplateElement) => {
    const childData: ElementData | null = getElement(childElement.name);
    return applyModifiers(node, partial(elementMap, childData)  , childElement);
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
