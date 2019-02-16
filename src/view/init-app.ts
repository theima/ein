import { rootElementMap } from './functions/element-map/root-element.map';
import { NodeAsync } from '../node-async';
import { map } from 'rxjs/operators';

import { ViewHtmlElementData } from '../html-template/types-and-interfaces/html-element-data/view.html-element-data';
import { NodeViewHtmlElementData } from '../html-template/types-and-interfaces/html-element-data/node-view.html-element-data';
import { createElementDataLookup } from '../html-template/functions/create-element-data-lookup';
import { ModelValueMapData } from '../html-template';
import { HtmlComponentElementData } from '../html-component/types-and-interfaces/html-component-element-data';
import { createComponentDataLookup } from '../html-component/functions/create-component-data-lookup';
import { HTMLRenderer } from '../html-renderer/functions/html-renderer';
import { GroupHtmlElementData } from '../html-template/types-and-interfaces/html-element-data/group.html-element.data';

export function initApp(target: string, node: NodeAsync<object>,
                        viewName: string, elements: Array<ViewHtmlElementData | NodeViewHtmlElementData | GroupHtmlElementData>,
                        maps: ModelValueMapData[],
                        components: Array<HtmlComponentElementData<Element>>): void {
  const getElementData = createElementDataLookup(elements, maps);
  const getComponentData = createComponentDataLookup(components, maps);
  const getElement = (name: string) => {
    return getComponentData(name) || getElementData(name);
  };
  const elementMap = rootElementMap(getElement, viewName, node);
  const e = document.getElementById(target);
  const viewMap = (m: object) => {
    return elementMap(m, m);
  };
  if (e) {
    HTMLRenderer(e, (node as any).pipe(map(viewMap)));
  }
}
