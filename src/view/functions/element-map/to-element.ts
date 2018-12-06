import { ElementData, ModelMap, NodeElementData, TemplateElement, ViewEvent } from '../../index';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { Element } from '../../types-and-interfaces/element';
import { ModelToElementOrNull } from '../../types-and-interfaces/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/model-to-elements';
import { createElement } from './create-element';
import { mapContent } from './map-content';
import { mapAttributes } from './map-attributes';
import { Observable } from 'rxjs';

export function toElement(template: TemplateElement,
                          data: ElementData | NodeElementData | null,
                          content: Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                          eventStream: Observable<ViewEvent> | null,
                          applyEventHandlers: (children: Array<Element | string>) => Array<Element | string>,
                          map: ModelMap,
                          model: object): Element {
  const mappedAttributes = mapAttributes(template.attributes, model);
  const mappedContent = mapContent(content, model, map);
  const e = createElement(template.name, mappedAttributes, mappedContent, eventStream);
  return {...e, content: applyEventHandlers(e.content)};
}
