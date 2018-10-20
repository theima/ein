import { DynamicAttribute, ModelMap, ViewEvent } from '../../index';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { Element } from '../../types-and-interfaces/element';
import { Observable } from 'rxjs';
import { ModelToElementOrNull } from '../../types-and-interfaces/model-to-element-or-null';
import { Attribute } from '../../types-and-interfaces/attribute';
import { ModelToElements } from '../../types-and-interfaces/model-to-elements';
import { createElement } from './create-element';
import { mapContent } from './map-content';
import { mapAttributes } from './map-attributes';

export function toElement(name: string,
                          attributes: Array<Attribute | DynamicAttribute>,
                          content: Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                          eventStream: Observable<ViewEvent> | null,
                          map: ModelMap,
                          model: object): Element {
  const mappedAttributes = mapAttributes(attributes, model);
  const mappedContent = mapContent(content, model, map);
  return createElement(name, mappedAttributes, mappedContent, eventStream);
}
