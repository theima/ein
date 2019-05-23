import { Element } from '../../view/index';
import { Observable } from 'rxjs';
import { Property } from '../../view/types-and-interfaces/property';
import { mapAttributes } from '../../view/functions/element-map/map-attributes';
import { Action, partial } from '../../core';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { SetNativeElementLookup } from '../types-and-interfaces/set-native-element-lookup';
import { ContentTemplateElement } from '../../view/types-and-interfaces/templates/content.template-element';
import { ComponentElement } from '../types-and-interfaces/component.element';

export function toComponentElement(actionStream: Observable<Action>,
                                   childStream: Observable<Array<Element | string>>,
                                   willBeDestroyed: () => void,
                                   updateChildren: (attributes: Property[], insertedContentModel: object) => void,
                                   setElementLookup: SetNativeElementLookup<any>,
                                   element: ContentTemplateElement,
                                   model: object,
                                   im: object): ComponentElement {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mappedAttributes: Property[] = mapAttributes(element.attributes, model).map(lowerCaseName) as any;
  const componentElement: ComponentElement = {
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
  return componentElement;
}
