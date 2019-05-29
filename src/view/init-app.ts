import { rootElementMap } from './functions/element-map/root-element.map';
import { NodeAsync } from '../node-async';
import { map } from 'rxjs/operators';
import { createHtmlMap } from '../html-parser/functions/create-html-map';
import { ModelValueMapDescriptor } from '../html-parser';
import { HTMLRenderer } from '../html-renderer/functions/html-renderer';
import { BuiltIn } from './types-and-interfaces/built-in';
import { eGroup } from './elements/e-group';
import { ExtenderDescriptor } from '../html-renderer/types-and-interfaces/extender.descriptor';
import { ElementDescriptor } from './types-and-interfaces/descriptors/element-descriptor';
import { get, arrayToDict, partial } from '../core';
import { lowerCasePropertyValue } from '../core/functions/lower-case-property-value';
import { CustomElementDescriptor } from './types-and-interfaces/descriptors/custom.element-descriptor';
import { isCustomElementDescriptor } from './functions/type-guards/is-custom-element-descriptor';

export function initApp(target: string,
                        node: NodeAsync<object>,
                        viewName: string,
                        elements: Array<CustomElementDescriptor | ElementDescriptor>,
                        maps: ModelValueMapDescriptor[],
                        extenders: ExtenderDescriptor[]): void {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const htmlMap = createHtmlMap(maps);
  const views: ElementDescriptor[] = elements.map(e=> {
    if (isCustomElementDescriptor(e)) {
      return htmlMap(e);
    }
    return e;
  }).map(lowerCaseName) as any;
  const viewDict = arrayToDict('name', views);
  const getDescriptor: (name: string) => ElementDescriptor | null = (name: string) => {
    return get(viewDict, name.toLowerCase());
  };
  const getDefaultDescriptor = (name: string) => {
    if (name === BuiltIn.Group) {
      return eGroup;
    }
    return null;
  };
  const getElement = (name: string) => {
    return getDefaultDescriptor(name) || getDescriptor(name);
  };
  const elementMap = rootElementMap(getElement, viewName, node);
  const e = document.getElementById(target);
  const viewMap = (m: object) => {
    return elementMap(m, m);
  };
  if (e) {
    HTMLRenderer(e, (node as any).pipe(map(viewMap)), extenders);
  }
}
