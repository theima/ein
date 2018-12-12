import { ComponentElementData, Element, TemplateElement, ViewEvent } from '../../index';
import { Observable } from 'rxjs';
import { Attribute } from '../../types-and-interfaces/attribute';
import { mapAttributes } from './map-attributes';
import { partial } from '../../../core';
import { lowerCasePropertyValue } from '../../../core/functions/lower-case-property-value';
import { LiveElement } from '../../types-and-interfaces/elements/live-element';
import { SetNativeElementLookup } from '../../types-and-interfaces/set-native-element-lookup';

export function toComponentElement(eventStream: Observable<ViewEvent>,
                                   childStream: Observable<Array<Element | string>>,
                                   willBeDestroyed: () => void,
                                   updateChildren: (attributes: Attribute[]) => void,
                                   setElementLookup: SetNativeElementLookup<any>,
                                   id: string,
                                   template: TemplateElement,
                                   data: ComponentElementData,
                                   model: object): LiveElement {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mappedAttributes: Attribute[] = mapAttributes(template.attributes, model).map(lowerCaseName) as any;
  const element: LiveElement = {
    name: template.name,
    id,
    attributes: mappedAttributes,
    childStream,
    setElementLookup,
    willBeDestroyed,
    sendChildUpdate: () => {
      updateChildren(mappedAttributes);
    }
  };
  if (eventStream) {
    element.eventStream = eventStream;
  }

  return element;
}
