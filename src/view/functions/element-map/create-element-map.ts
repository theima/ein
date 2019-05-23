import { ModelToElement } from '../..';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { mapAttributes } from './map-attributes';
import { mapContent } from './map-content';
import { FilledTemplateElement } from '../../types-and-interfaces/templates/filled.template-element';

export function createElementMap(templateElement: FilledTemplateElement,
                                 viewId: string,
                                 contentMap: (e: FilledTemplateElement | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot): ModelToElement {
  const mappedElementContent: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot> = templateElement.content.map(contentMap);

  return (m: object, im: object) => {
    const attributes = mapAttributes(templateElement.properties, m);
    const content = mapContent(viewId, mappedElementContent, m, im);

    return {
      name: templateElement.name,
      id: viewId,
      properties: attributes,
      content
    };
  };
}
