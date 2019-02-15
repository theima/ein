import { ModelMap } from '../../index';
import { Element } from '../../types-and-interfaces/elements/element';
import { createElement } from './create-element';
import { mapContent } from './map-content';
import { mapAttributes } from './map-attributes';
import { Observable } from 'rxjs';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { ContentTemplateElement } from '../../types-and-interfaces/templates/content.template-element';
import { Action } from '../../../core';

export function toViewElement(actionStream: Observable<Action>,
                              applyActionHandlers: (children: Array<Element | string>) => Array<Element | string>,
                              map: ModelMap,
                              element: ContentTemplateElement,
                              model: object,
                              insertedContentModel: object): StaticElement {
  const mappedAttributes = mapAttributes(element.attributes, model);
  const mappedContent = mapContent(element.id, element.content, model, insertedContentModel, map);
  const e = createElement(element.name, element.id, mappedAttributes, mappedContent, actionStream);
  return {...e, content: applyActionHandlers(e.content)};
}
