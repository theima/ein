import { ElementData, ModelToElement, TemplateElement } from '../..';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { Slot } from '../../types-and-interfaces/slots/slot';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { insertContentInView } from '../insert-content-in-view';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { mapAttributes } from './map-attributes';
import { mapContent } from './map-content';

export function createElementMap(templateElement: TemplateElement,
                                 viewId: string,
                                 insertedContentOwnerId: string,
                                 elementData: ElementData | null,
                                 contentMap: (e: TemplateElement | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot): ModelToElement {
  let insertedContent: Array<TemplateElement | ModelToString | Slot> = templateElement.content;
  let elementContent: Array<TemplateElement | ModelToString | FilledSlot> = insertedContent;
  if (elementData) {
    elementContent = insertContentInView(insertedContentOwnerId, elementData.children, insertedContent);
  }

  const mappedElementContent: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot> = elementContent.map(contentMap);

  return (m: object, im: object) => {
    const attributes = mapAttributes(templateElement.attributes, m);
    const content = mapContent(viewId, mappedElementContent, m, im);

    return {
      name: templateElement.name,
      id: viewId,
      attributes,
      content
    };
  };
}
