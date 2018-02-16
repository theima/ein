import { Emce } from 'emce';
import { Dict } from '../core/types-and-interfaces/dict';
import { ViewData } from './types-and-interfaces/view-data';
import { MapData } from './types-and-interfaces/map-data';
import { arrayToDict } from '../core/functions/array-to-dict';
import { createNodeRenderer } from './functions/create-node-renderer';

import { createElementMap } from './functions/create-element-map';
import { createRenderData } from './functions/create-render-data';
import { EmceViewData } from './types-and-interfaces/emce-view-data';
import { EmceAsync } from 'emce-async';
import { partial } from '../core/functions/partial';

export function initApp(target: string, emce: Emce<any>, viewName: string, views: Array<ViewData | EmceViewData>, maps: MapData[]): void {
  let viewDict: Dict<ViewData | EmceViewData> = arrayToDict('name', views);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);

  const baseView = viewDict[viewName];
  const baseTemplate = {
    tag: baseView.name,
    children: baseView.children,
    properties: [],
    dynamicProperties: []
  };
  let modelToElementMap = partial(createElementMap, mapDict);
  let toRenderData = createRenderData(viewDict);
  const nodeRenderer = createNodeRenderer(modelToElementMap);
  const data = toRenderData(baseTemplate, nodeRenderer);
  nodeRenderer(document.getElementById(target) as HTMLElement, emce as EmceAsync<any>, data);
}
