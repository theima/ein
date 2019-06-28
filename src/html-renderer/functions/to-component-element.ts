import { Element } from '../../view/index';
import { Observable } from 'rxjs';
import { Property } from '../../view/types-and-interfaces/property';
import { mapProperties } from '../../view/functions/element-map/map-properties';
import { Action, partial, Value } from '../../core';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { SetNativeElementLookup } from '../types-and-interfaces/set-native-element-lookup';
import { ContentElementTemplate } from '../../view/types-and-interfaces/templates/content.element-template';
import { ComponentElement } from '../types-and-interfaces/component.element';

export function toComponentElement(actionStream: Observable<Action>,
                                   childStream: Observable<Array<Element | string>>,
                                   willBeDestroyed: () => void,
                                   updateChildren: (properties: Property[], insertedContentModel: Value) => void,
                                   setElementLookup: SetNativeElementLookup<any>,
                                   element: ContentElementTemplate,
                                   model: Value,
                                   im: Value): ComponentElement {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapped: Property[] = mapProperties(element.properties, model).map(lowerCaseName) as any;
  const componentElement: ComponentElement = {
    name: element.name,
    id: element.id,
    properties: mapped,
    childStream,
    setElementLookup,
    willBeDestroyed,
    sendChildUpdate: () => {
      updateChildren(mapped, model);
    },
    actionStream
  };
  return componentElement;
}
