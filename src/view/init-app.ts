import { arrayToDict, Dict } from '../core';
import { snabbdomRenderer } from '../html-renderer/functions/snabbdom-renderer';
import { renderMap } from './functions/render.map';
import { NodeAsync } from '../node-async';
import 'rxjs/add/operator/map';
import { ElementData } from './types-and-interfaces/element-data';
import { NodeElementData } from './types-and-interfaces/node-element-data';
import { HtmlElementData } from '../html-template/types-and-interfaces/html-element-data';
import { HtmlNodeElementData } from '../html-template/types-and-interfaces/html-node-element-data';
import { createTemplates } from '../html-template/functions/create-templates';
import { MapData } from '../html-template';

export function initApp(target: string, node: NodeAsync<object>, viewName: string, elements: Array<HtmlElementData | HtmlNodeElementData>, maps: MapData[]): void {
  let elementDict: Dict<ElementData | NodeElementData> = createTemplates(elements, maps);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);
  const map = renderMap(elementDict, mapDict, viewName, node);
  const e = document.getElementById(target);
  if (e) {
    snabbdomRenderer(e, (node as any).map(map));
  }
}
