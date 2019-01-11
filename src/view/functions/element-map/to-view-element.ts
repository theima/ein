import { ModelMap, TemplateElement, ViewEvent } from '../../index';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { createElement } from './create-element';
import { mapContent } from './map-content';
import { mapAttributes } from './map-attributes';
import { Observable } from 'rxjs';
import { StaticElement } from '../../types-and-interfaces/elements/static-element';

export function toViewElement(content: Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                              eventStream: Observable<ViewEvent>,
                              applyEventHandlers: (children: Array<Element | string>) => Array<Element | string>,
                              map: ModelMap,
                              id: string,
                              template: TemplateElement,
                              model: object): StaticElement {
  const mappedAttributes = mapAttributes(template.attributes, model);
  const mappedContent = mapContent(content, model, map);
  const e = createElement(template.name, id, mappedAttributes, mappedContent, eventStream);
  return {...e, content: applyEventHandlers(e.content)};
}
