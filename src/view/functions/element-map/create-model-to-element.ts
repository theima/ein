import { ModelToElement } from '../..';
import { partial, Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { ElementContent } from '../../types-and-interfaces/elements/element-content';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { elementContentMap } from './element-content.map';
import { modelToElementContent } from './model-to-element-content';
import { modelToProperties } from './model-to-properties';

export function createModelToElement(template: ElementTemplate,
                                     viewId: string,
                                     elementMap: (e: ElementTemplate) => ModelToElementOrNull | ModelToElements): ModelToElement {
  const contentMap = partial(
      elementContentMap,
      elementMap);
  const mappedElementContent: Array<ModelToElementOrNull | ModelToString | ModelToElements> = template.content.map(contentMap);

  return (m: Value) => {
    const properties = modelToProperties(template.properties, m);
    const content: ElementContent = modelToElementContent(mappedElementContent, m);

    return {
      name: template.name,
      id: viewId,
      properties,
      content
    };
  };
}
