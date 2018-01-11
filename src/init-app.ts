import {patch} from './patch';
import {Emce} from 'emce';
import {VNode} from 'snabbdom/vnode';
import {createElementFromTemplate} from './functions/create-element-from-template';
import {Dict} from './types-and-interfaces/dict';
import {ViewData} from './types-and-interfaces/view-data';
import {Element} from './types-and-interfaces/element';

export function initApp(target: string, emce: Emce<any>, elm: string, views: ViewData[]): void {
  let dict: Dict<ViewData> = views.reduce(
    (d: Dict<ViewData>, e: ViewData) => {
      d[e.tag] = e;
      return d;
    }, {});
  let elementFromTemplate = createElementFromTemplate(dict);

  function initer(e: (m: any) => Element) {
    let container: any = document.getElementById(target);
    emce.subscribe(m => {
      container = patch(container, e(m) as any);
    });
  }

  initer(elementFromTemplate(dict[elm].template));
}
