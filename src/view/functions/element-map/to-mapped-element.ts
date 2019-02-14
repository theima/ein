import { createElement } from './create-element';
import { mapContent } from './map-content';
import { mapAttributes } from './map-attributes';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { ContentTemplateElement } from '../../types-and-interfaces/templates/content.template-element';
import { ModelMap } from '../..';

export function toMappedElement(map: ModelMap,
                                element: ContentTemplateElement,
                                model: object,
                                insertedContentModel: object): StaticElement {
  const mappedAttributes = mapAttributes(element.attributes, model);
  const mappedContent = mapContent(element.id, element.content, model, insertedContentModel, map);
  const e = createElement(element.name, element.id, mappedAttributes, mappedContent, null);
  return {...e};
}
