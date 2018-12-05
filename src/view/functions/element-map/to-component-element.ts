import { DynamicAttribute, Element, ViewEvent } from '../../index';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { Observable } from 'rxjs';
import { ModelToElementOrNull } from '../../types-and-interfaces/model-to-element-or-null';
import { Attribute } from '../../types-and-interfaces/attribute';
import { ModelToElements } from '../../types-and-interfaces/model-to-elements';
import { SetNativeElementLookup } from '../../types-and-interfaces/set-native-element-lookup';
import { mapContent } from './map-content';
import { mapAttributes } from './map-attributes';
import { arrayToDict, partial } from '../../../core';
import { lowerCasePropertyValue } from '../../../core/functions/lower-case-property-value';
import { LiveElement } from '../../types-and-interfaces/live-element';

export function toComponentElement(name: string,
                                   attributes: Array<Attribute | DynamicAttribute>,
                                   content: Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                                   eventStream: Observable<ViewEvent> | null,
                                   childStream: Observable<Array<Element | string>>,
                                   lookUp: SetNativeElementLookup<any> | null,
                                   model: object): LiveElement {

  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mappedAttributes: Attribute[] = mapAttributes(attributes, model).map(lowerCaseName) as any;
  const attrDict = arrayToDict(a => a.value, 'name', mappedAttributes);
  const mappedContent = mapContent(content, attrDict);
  const element: LiveElement = {
    name,
    id:'',
    attributes: mappedAttributes,
    childStream,
    content: mappedContent
  };
  if (eventStream) {
    element.eventStream = eventStream;
  }
  if (lookUp) {
    element.setElementLookup = lookUp;
  }
  return element;
}
