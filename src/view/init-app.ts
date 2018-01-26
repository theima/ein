import {patch} from './patch';
import {Emce} from 'emce';
import {createRenderMapFromElementTemplate} from './functions/create-render-map-from-element-template';
import {Dict} from '../core/types-and-interfaces/dict';
import {ViewData} from './types-and-interfaces/view-data';
import {Element} from './types-and-interfaces/element';
import {MapData} from './types-and-interfaces/map-data';
import {arrayToDict} from '../core/functions/array-to-dict';

export function initApp(target: string, emce: Emce<any>, elm: string, views: ViewData[], maps: MapData[]): void {
  let viewDict: Dict<ViewData> = arrayToDict('name', views);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);
  let elementFromTemplate = createRenderMapFromElementTemplate(viewDict, mapDict);

  function initer(e: (m: object) => Element) {
    let container: any = document.getElementById(target);
    emce.subscribe(m => {
      container = patch(container, e(m) as any);
    });
  }

  const baseView = viewDict[elm];
  const baseTemplate = {
    tag: baseView.name,
    children: baseView.children,
    properties: [],
    dynamicProperties: []
  };

  initer(elementFromTemplate(baseTemplate));
}
