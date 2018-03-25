import { Emce } from 'emce';
import { EmceAsync } from 'emce-async';
import { arrayToDict, Dict } from '../core';
import { createRoot, ViewData, EmceViewData, MapData } from '../html-template';
import { createViewMap } from './functions/create-view-map';
import { snabbdomRenderer } from '../html-renderer/functions/snabbdom-renderer';

export function initApp(target: string, emce: Emce<any>, viewName: string, views: Array<ViewData | EmceViewData>, maps: MapData[]): void {
  let viewDict: Dict<ViewData | EmceViewData> = arrayToDict('name', views);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);
  //const nodeRenderer = createVNodeRenderer(createElementMap);
  const data = createRoot(viewDict, mapDict, viewName);
  const map = createViewMap(data, emce as EmceAsync<object>);
  const e = document.getElementById(target);
  if (e) {
    snabbdomRenderer(e, (emce as any).map(map));
  }
  //nodeRenderer(document.getElementById(target) as HTMLElement, emce as EmceAsync<any>, data);
}
