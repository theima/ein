import { DynamicAttribute, Element, ViewEvent } from '../../index';
import { Observable } from 'rxjs';
import { Attribute } from '../../types-and-interfaces/attribute';
import { SetNativeElementLookup } from '../../types-and-interfaces/set-native-element-lookup';
import { mapAttributes } from './map-attributes';
import { partial } from '../../../core';
import { lowerCasePropertyValue } from '../../../core/functions/lower-case-property-value';
import { LiveElement } from '../../types-and-interfaces/live-element';

export function toComponentElement(name: string,
                                   attributes: Array<Attribute | DynamicAttribute>,
                                   eventStream: Observable<ViewEvent> | null,
                                   childStream: Observable<Array<Element | string>>,
                                   lookUp: SetNativeElementLookup<any> | null,
                                   model: object): LiveElement {

  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mappedAttributes: Attribute[] = mapAttributes(attributes, model).map(lowerCaseName) as any;
  const element: LiveElement = {
    name,
    id:'',
    attributes: mappedAttributes,
    childStream,
    content: []
  };
  if (eventStream) {
    element.eventStream = eventStream;
  }
  if (lookUp) {
    element.setElementLookup = lookUp;
  }
  return element;
}
