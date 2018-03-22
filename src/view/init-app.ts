import { Emce } from 'emce';
import { ViewData } from '../html-template/types-and-interfaces/view-data';
import { MapData } from '../html-template/types-and-interfaces/map-data';
import { arrayToDict, Dict, partial } from '../core';
import { createVNodeRenderer } from '../html-renderer';
import { createElementMap } from './functions/create-element-map';
import { createRoot } from '../html-template/functions/create-root';
import { EmceViewData } from '../html-template/types-and-interfaces/emce-view-data';
import { EmceAsync } from 'emce-async';

export function initApp(target: string, emce: Emce<any>, viewName: string, views: Array<ViewData | EmceViewData>, maps: MapData[]): void {
  let viewDict: Dict<ViewData | EmceViewData> = arrayToDict('name', views);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);
  //The 'any' trickery here is because typescript didn't like sending in the generic to partial.
  const nodeRenderer = createVNodeRenderer(partial(createElementMap as any, mapDict));
  const data = createRoot(viewDict, mapDict, viewName);
  nodeRenderer(document.getElementById(target) as HTMLElement, emce as EmceAsync<any>, data);
}
