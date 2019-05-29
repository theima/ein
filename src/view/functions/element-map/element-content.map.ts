import { ElementDescriptor } from '../..';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { isSlot } from '../type-guards/is-slot';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';

export function elementContentMap(elementMap: (template: FilledElementTemplate) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot,
                                  getElement: (name: string) => ElementDescriptor | null,
                                  template: FilledElementTemplate | ModelToString | FilledSlot): ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot {

  const contentMap: (t: FilledElementTemplate | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot =
    (template: FilledElementTemplate | ModelToString | FilledSlot) => {
      if (typeof template === 'function') {
        return template;
      }
      if (isSlot(template)) {
        const slot: MappedSlot = { slot: true, mappedSlot: true };
        if (template.content) {
          slot.content = template.content.map(contentMap);
          slot.mappedFor = template.filledFor;
        }
        return slot;
      }
      return elementMap(template);
    };
  return contentMap(template);
}
