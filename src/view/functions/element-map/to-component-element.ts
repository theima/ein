import { Element } from '../../index';
import { Observable } from 'rxjs';
import { Attribute } from '../../types-and-interfaces/attribute';
import { mapAttributes } from './map-attributes';
import { Action, partial } from '../../../core';
import { lowerCasePropertyValue } from '../../../core/functions/lower-case-property-value';
import { LiveElement } from '../../types-and-interfaces/elements/live.element';
import { SetNativeElementLookup } from '../../types-and-interfaces/set-native-element-lookup';
import { ContentTemplateElement } from '../../types-and-interfaces/templates/content.template-element';

export function toComponentElement(actionStream: Observable<Action>,
                                   childStream: Observable<Array<Element | string>>,
                                   willBeDestroyed: () => void,
                                   updateChildren: (attributes: Attribute[], insertedContentModel: object) => void,
                                   setElementLookup: SetNativeElementLookup<any>,
                                   element: ContentTemplateElement,
                                   model: object): LiveElement {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mappedAttributes: Attribute[] = mapAttributes(element.attributes, model).map(lowerCaseName) as any;
  const liveElement: LiveElement = {
    name: element.name,
    id: element.id,
    attributes: mappedAttributes,
    childStream,
    setElementLookup,
    willBeDestroyed,
    sendChildUpdate: () => {
      updateChildren(mappedAttributes, model);
    },
    actionStream
  };
  return liveElement;
}
