import {patch} from './patch';
import {Emce} from 'emce';
import {createElementFromTemplate} from './functions/create-element-from-template';
import {Dict} from './types-and-interfaces/dict';
import {ViewData} from './types-and-interfaces/view-data';
import {Element} from './types-and-interfaces/element';
import {MapData} from './types-and-interfaces/map-data';
import {arrayToDict} from './core/array-to-dict';

export function initApp(target: string, emce: Emce<any>, elm: string, views: ViewData[], maps: MapData[]): void {
  let viewDict: Dict<ViewData> = arrayToDict('name', views);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);
  let elementFromTemplate = createElementFromTemplate(viewDict, mapDict);

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
    attributes: [],
    dynamicAttributes: []
  };

  initer(elementFromTemplate(baseTemplate));
}
