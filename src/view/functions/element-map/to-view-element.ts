import { ModelMap, ViewEvent } from '../../index';
import { Element } from '../../types-and-interfaces/elements/element';
import { createElement } from './create-element';
import { mapContent } from './map-content';
import { mapAttributes } from './map-attributes';
import { Observable } from 'rxjs';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { ContentTemplateElement } from '../../types-and-interfaces/templates/content.template-element';

export function toViewElement(eventStream: Observable<ViewEvent>,
                              applyEventHandlers: (children: Array<Element | string>) => Array<Element | string>,
                              map: ModelMap,
                              element: ContentTemplateElement,
                              model: object,
                              insertedContentModel: object): StaticElement {
  const mappedAttributes = mapAttributes(element.attributes, model);
  const mappedContent = mapContent(element.id, element.content, model, insertedContentModel, map);
  const e = createElement(element.name, element.id, mappedAttributes, mappedContent, eventStream);
  return {...e, content: applyEventHandlers(e.content)};
}
