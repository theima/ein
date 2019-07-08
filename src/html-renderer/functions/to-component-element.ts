import { Element } from '../../view/index';
import { Observable } from 'rxjs';
import { Property } from '../../view/types-and-interfaces/property';
import { mapProperties } from '../../view/functions/element-map/map-properties';
import { partial, Value } from '../../core';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { ContentElementTemplate } from '../../view/types-and-interfaces/templates/content.element-template';
import { ComponentElement } from '../types-and-interfaces/component.element';
import { InitiateComponent } from '../types-and-interfaces/initiate-component';

export function toComponentElement(initiate: InitiateComponent,
                                   childStream: Observable<Array<Element | string>>,
                                   willBeDestroyed: () => void,
                                   updateChildren: (properties: Property[], insertedContentModel: Value) => void,
                                   element: ContentElementTemplate,
                                   model: Value,
                                   im: Value): ComponentElement {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapped: Property[] = mapProperties(element.properties, model).map(lowerCaseName) as any;
  const componentElement: ComponentElement = {
    initiate,
    name: element.name,
    id: element.id,
    properties: mapped,
    childStream,
    willBeDestroyed,
    sendChildUpdate: () => {
      updateChildren(mapped, model);
    }
  };
  return componentElement;
}
