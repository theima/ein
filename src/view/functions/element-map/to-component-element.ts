import { DynamicAttribute, ViewEvent } from '../../index';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { Element } from '../../types-and-interfaces/element';
import { Observable } from 'rxjs';
import { ModelToElementOrNull } from '../../types-and-interfaces/model-to-element-or-null';
import { Attribute } from '../../types-and-interfaces/attribute';
import { ModelToElements } from '../../types-and-interfaces/model-to-elements';
import { SetNativeElementLookup } from '../../types-and-interfaces/set-native-element-lookup';
import { mapContent } from './map-content';
import { createElement } from './create-element';
import { mapAttributes } from './map-attributes';
import { arrayToDict, partial } from '../../../core';
import { lowerCasePropertyValue } from '../../../core/functions/lower-case-property-value';

export function toComponentElement(name: string,
                                   attributes: Array<Attribute | DynamicAttribute>,
                                   content: Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                                   eventStream: Observable<ViewEvent> | null,
                                   lookUp: SetNativeElementLookup<any> | null,
                                   model: object): Element {

  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mappedAttributes: Attribute[] = mapAttributes(attributes, model).map(lowerCaseName) as any;
  const attrDict = arrayToDict(a => a.value, 'name', mappedAttributes);
  const mappedContent = mapContent(content, attrDict);
  const element = createElement(name, mappedAttributes, mappedContent, eventStream);
  if (lookUp) {
    element.setElementLookup = lookUp;
  }
  return element;
}
