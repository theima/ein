import { ComponentElementData, Element, TemplateElement, ViewEvent } from '../../index';
import { Observable } from 'rxjs';
import { Attribute } from '../../types-and-interfaces/attribute';
import { mapAttributes } from './map-attributes';
import { partial } from '../../../core';
import { lowerCasePropertyValue } from '../../../core/functions/lower-case-property-value';
import { LiveElement } from '../../types-and-interfaces/elements/live-element';

export function toComponentElement(template: TemplateElement,
                                   data: ComponentElementData,
                                   eventStream: Observable<ViewEvent>,
                                   childStream: Observable<Array<Element | string>>,
                                   completeStream: () => void,
                                   updateChildren: (attributes: Attribute[]) => void,
                                   model: object): LiveElement {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mappedAttributes: Attribute[] = mapAttributes(template.attributes, model).map(lowerCaseName) as any;
  const element: LiveElement = {
    name: template.name,
    id: '',
    attributes: mappedAttributes,
    childStream,
    setElementLookup: data.setElementLookup,
    completeStream
  };
  if (eventStream) {
    element.eventStream = eventStream;
  }
  updateChildren(mappedAttributes);
  return element;
}
