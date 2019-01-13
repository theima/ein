import { createElement } from './create-element';
import { mapContent } from './map-content';
import { mapAttributes } from './map-attributes';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { ContentTemplateElement } from '../../types-and-interfaces/templates/content.template-element';

export function toElement(id: string,
                          element: ContentTemplateElement,
                          model: object): StaticElement {
  const mappedAttributes = mapAttributes(element.attributes, model);
  const mappedContent = mapContent(element.content, model);
  const e = createElement(element.name, id, mappedAttributes, mappedContent, null);
  return {...e};
}
