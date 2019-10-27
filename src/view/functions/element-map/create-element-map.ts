import { ModelToElement } from '../..';
import { Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { mapContent } from './map-content';
import { mapProperties } from './map-properties';

export function createElementMap(template: FilledElementTemplate,
                                 viewId: string,
                                 contentMap: (e: FilledElementTemplate | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot): ModelToElement {
  const mappedElementContent: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot> = template.content.map(contentMap);

  return (m: Value, im: Value) => {
    const properties = mapProperties(template.properties, m);
    const content = mapContent(viewId, mappedElementContent, m, im);

    return {
      name: template.name,
      id: viewId,
      properties,
      content
    };
  };
}
