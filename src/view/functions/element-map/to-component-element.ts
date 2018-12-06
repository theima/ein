import { ComponentElementData, Element, TemplateElement, ViewEvent } from '../../index';
import { Observable } from 'rxjs';
import { Attribute } from '../../types-and-interfaces/attribute';
import { mapAttributes } from './map-attributes';
import { partial } from '../../../core';
import { lowerCasePropertyValue } from '../../../core/functions/lower-case-property-value';
import { LiveElement } from '../../types-and-interfaces/live-element';

export function toComponentElement(template: TemplateElement,
                                   data: ComponentElementData,
                                   eventStream: Observable<ViewEvent> | null,
                                   childStream: Observable<Array<Element | string>>,
                                   model: object): LiveElement {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mappedAttributes: Attribute[] = mapAttributes(template.attributes, model).map(lowerCaseName) as any;
  const element: LiveElement = {
    name: template.name,
    id: '',
    attributes: mappedAttributes,
    childStream,
    content: [],
    setElementLookup: data.setElementLookup
  };
  if (eventStream) {
    element.eventStream = eventStream;
  }
  data.updateChildren(mappedAttributes);
  return element;
}
