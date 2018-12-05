import { rootElementMap } from './functions/element-map/root-element.map';
import { NodeAsync } from '../node-async';
import { map } from 'rxjs/operators';

import { HtmlElementData } from '../html-template/types-and-interfaces/html-element-data';
import { HtmlNodeElementData } from '../html-template/types-and-interfaces/html-node-element-data';
import { createElementDataLookup } from '../html-template/functions/create-element-data-lookup';
import { TemplateMapData } from '../html-template';
import { HtmlComponentElementData } from '../html-component/types-and-interfaces/html-component-element-data';
import { createComponentDataLookup } from '../html-component/functions/create-component-data-lookup';
import { HTMLRenderer } from '../html-renderer/functions/html-renderer';

export function initApp(target: string, node: NodeAsync<object>,
                        viewName: string, elements: Array<HtmlElementData | HtmlNodeElementData>,
                        maps: TemplateMapData[],
                        components: Array<HtmlComponentElementData<Element>>): void {
  const getElementData = createElementDataLookup(elements, maps);
  const getComponentData = createComponentDataLookup(components, maps);
  const getElement = (name: string) => {
    return getComponentData(name) || getElementData(name);
  };
  const elementMap = rootElementMap(getElement, viewName, node);
  const e = document.getElementById(target);
  if (e) {
    HTMLRenderer(e, (node as any).pipe(map(elementMap)));
  }
}
