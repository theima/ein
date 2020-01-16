import { ModelToElement } from '../..';
import { Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { mapContent } from './map-content';
import { mapProperties } from './map-properties';

export function createElementMap(template: ElementTemplate,
                                 viewId: string,
                                 contentMap: (e: ElementTemplate | ModelToString) => ModelToElementOrNull | ModelToElements | ModelToString): ModelToElement {
  const mappedElementContent: Array<ModelToElementOrNull | ModelToString | ModelToElements> = template.content.map(contentMap);

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
