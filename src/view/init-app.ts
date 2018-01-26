import {patch} from './patch';
import {Emce} from 'emce';
import {createRenderMap} from './functions/create-render-map';
import {Dict} from '../core/types-and-interfaces/dict';
import {ViewData} from './types-and-interfaces/view-data';
import {MapData} from './types-and-interfaces/map-data';
import {arrayToDict} from '../core/functions/array-to-dict';
import { createNode } from './functions/create-node';

export function initApp(target: string, emce: Emce<any>, elm: string, views: ViewData[], maps: MapData[]): void {
  let viewDict: Dict<ViewData> = arrayToDict('name', views);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);

  const createRootNode = createNode(viewDict, mapDict);
  createRootNode(document.getElementById(target) as HTMLElement,elm, emce);

}
