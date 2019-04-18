import { ElementData, ModelToElement, TemplateElement } from '../..';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { isSlot } from '../type-guards/is-slot';
import { NodeAsync } from '../../../node-async';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';

export function childElementMap(elementMap: (elementData: ElementData | null,
                                             node: NodeAsync<object>,
                                             templateElement: TemplateElement) => ModelToElement,
                                getElement: (name: string) => ElementData | null,
                                node: NodeAsync<object>,
                                templateElement: TemplateElement | ModelToString | FilledSlot): ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot {

  const contentMap: (e: TemplateElement | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot =
    (templateElement: TemplateElement | ModelToString | FilledSlot) => {
      if (typeof templateElement === 'function') {
        return templateElement;
      }
      if (isSlot(templateElement)) {
        const slot: MappedSlot = { slot: true, mappedSlot: true };
        if (templateElement.content) {
          slot.content = templateElement.content.map(contentMap);
          slot.mappedFor = templateElement.filledFor;
        }
        return slot;
      }
      const elementData: ElementData | null = getElement(templateElement.name);
      return elementMap(elementData, node, templateElement);
    };
  return contentMap(templateElement);
}
