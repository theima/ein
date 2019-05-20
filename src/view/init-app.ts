import { rootElementMap } from './functions/element-map/root-element.map';
import { NodeAsync } from '../node-async';
import { map } from 'rxjs/operators';
import { createHtmlMap } from '../html-template/functions/create-html-map';
import { ModelValueMapData } from '../html-template';
import { HTMLRenderer } from '../html-renderer/functions/html-renderer';
import { BuiltIn } from './types-and-interfaces/built-in';
import { eGroup } from './elements/e-group';
import { ExtenderDescriptor } from '../html-renderer/types-and-interfaces/extender.descriptor';
import { ElementData } from './types-and-interfaces/datas/element-data';
import { get, arrayToDict, partial } from '../core';
import { lowerCasePropertyValue } from '../core/functions/lower-case-property-value';
import { CustomElementData } from './types-and-interfaces/datas/custom.element-data';
import { isCustomElementData } from './functions/type-guards/is-custom-element.data';

export function initApp(target: string,
                        node: NodeAsync<object>,
                        viewName: string,
                        elements: Array<CustomElementData | ElementData>,
                        maps: ModelValueMapData[],
                        extenders: ExtenderDescriptor[]): void {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const htmlMap = createHtmlMap(maps);
  const views: ElementData[] = elements.map( e=> {
    if (isCustomElementData(e)) {
      return htmlMap(e);
    }
    return e;
  }).map(lowerCaseName) as any;
  const viewDict = arrayToDict('name', views);
  const getElementData: (name: string) => ElementData | null = (name: string) => {
    return get(viewDict, name.toLowerCase());
  };
  const getDefaultElementData = (name: string) => {
    if (name === BuiltIn.Group) {
      return eGroup;
    }
    return null;
  };
  const getElement = (name: string) => {
    return getDefaultElementData(name) || getElementData(name);
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
