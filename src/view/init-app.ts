import { arrayToDict, Dict } from '../core';
import { ViewData, EmceViewData, MapData } from '../html-template';
import { snabbdomRenderer } from '../html-renderer/functions/snabbdom-renderer';
import { templateElementMap } from '../html-template/functions/template-element.map';
import { EmceAsync } from 'emce-async';

export function initApp(target: string, emce: EmceAsync<any>, viewName: string, views: Array<ViewData | EmceViewData>, maps: MapData[]): void {
  let viewDict: Dict<ViewData | EmceViewData> = arrayToDict('name', views);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);
  const map = templateElementMap(viewDict, mapDict, viewName, emce);
  const e = document.getElementById(target);
  if (e) {
    snabbdomRenderer(e, (emce as any).map(map));
  }
}
