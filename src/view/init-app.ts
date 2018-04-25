import { arrayToDict, Dict } from '../core';
import { ViewData, EmceViewData, MapData } from '../html-template';
import { snabbdomRenderer } from '../html-renderer/functions/snabbdom-renderer';
import { renderMap } from '../html-template/functions/render.map';
import { EmceAsync } from '../node-async';

export function initApp(target: string, emce: EmceAsync<any>, viewName: string, views: Array<ViewData | EmceViewData>, maps: MapData[]): void {
  let viewDict: Dict<ViewData | EmceViewData> = arrayToDict('name', views);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);
  const map = renderMap(viewDict, mapDict, viewName, emce);
  const e = document.getElementById(target);
  if (e) {
    snabbdomRenderer(e, (emce as any).map(map));
  }
}
