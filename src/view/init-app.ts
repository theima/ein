import { arrayToDict, Dict } from '../core';
import { ViewData, NodeViewData, MapData } from '../html-template';
import { snabbdomRenderer } from '../html-renderer/functions/snabbdom-renderer';
import { renderMap } from '../html-template/functions/render.map';
import { NodeAsync } from '../node-async';
import 'rxjs/add/operator/map';

export function initApp(target: string, node: NodeAsync<object>, viewName: string, views: Array<ViewData | NodeViewData>, maps: MapData[]): void {
  let viewDict: Dict<ViewData | NodeViewData> = arrayToDict('name', views);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);
  const map = renderMap(viewDict, mapDict, viewName, node);
  const e = document.getElementById(target);
  if (e) {
    snabbdomRenderer(e, (node as any).map(map));
  }
}
