import { arrayToDict, Dict } from '../core';
import { MapData } from '../html-template';
import { snabbdomRenderer } from '../html-renderer/functions/snabbdom-renderer';
import { renderMap } from '../html-template/functions/render.map';
import { NodeAsync } from '../node-async';
import 'rxjs/add/operator/map';
import { ElementData } from './types-and-interfaces/element-data';
import { NodeElementData } from './types-and-interfaces/node-element-data';

export function initApp(target: string, node: NodeAsync<object>, viewName: string, views: Array<ElementData | NodeElementData>, maps: MapData[]): void {
  let viewDict: Dict<ElementData | NodeElementData> = arrayToDict('name', views);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);
  const map = renderMap(viewDict, mapDict, viewName, node);
  const e = document.getElementById(target);
  if (e) {
    snabbdomRenderer(e, (node as any).map(map));
  }
}
