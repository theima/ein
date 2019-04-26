import { rootElementMap } from './functions/element-map/root-element.map';
import { NodeAsync } from '../node-async';
import { map } from 'rxjs/operators';
import { createElementDataLookup } from '../html-template/functions/create-element-data-lookup';
import { ModelValueMapData } from '../html-template';
import { HtmlComponentElementData } from '../html-component/types-and-interfaces/html-component-element-data';
import { createComponentDataLookup } from '../html-component/functions/create-component-data-lookup';
import { HTMLRenderer } from '../html-renderer/functions/html-renderer';
import { BuiltIn } from './types-and-interfaces/built-in';
import { eGroup } from './elements/e-group';
import { ExtenderDescriptor } from '../html-renderer/types-and-interfaces/extender.descriptor';
import { HtmlElementData } from '../html-template/types-and-interfaces/html-element-data';

export function initApp(target: string, node: NodeAsync<object>,
                        viewName: string, elements: HtmlElementData[],
                        maps: ModelValueMapData[],
                        components: Array<HtmlComponentElementData<Element>>, extenders: ExtenderDescriptor[]): void {
  const getElementData = createElementDataLookup(elements, maps);
  const getComponentData = createComponentDataLookup(components, maps);
  const getDefaultElementData = (name: string) => {
    if (name === BuiltIn.Group) {
      return eGroup;
    }
    return null;
  };
  const getElement = (name: string) => {
    return getDefaultElementData(name) || getComponentData(name) || getElementData(name);
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
