import { Emce } from 'emce';
import { EmceAsync } from 'emce-async';
import { arrayToDict, Dict } from '../core';
import { createVNodeRenderer } from '../html-renderer';
import { createRoot, ViewData, EmceViewData, MapData } from '../html-template';
import { createElementMap } from './functions/create-element-map';

export function initApp(target: string, emce: Emce<any>, viewName: string, views: Array<ViewData | EmceViewData>, maps: MapData[]): void {
  let viewDict: Dict<ViewData | EmceViewData> = arrayToDict('name', views);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);
  const nodeRenderer = createVNodeRenderer(createElementMap);
  const data = createRoot(viewDict, mapDict, viewName);
  nodeRenderer(document.getElementById(target) as HTMLElement, emce as EmceAsync<any>, data);
}
