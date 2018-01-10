import {patch} from './patch';
import {Emce} from 'emce';
import {VNode} from 'snabbdom/vnode';
import {toSnabbdomNode} from './functions/to-snabbdom-node';
import {createElementFromTemplate} from './functions/create-element-from-template';
import {RenderedElement} from './rendered-element';
import {Dict} from './types-and-interfaces/dict';
import {Element} from './element';

export function initApp(target: string, emce: Emce<any>, elm: string, views: Element[]): void {
  let dict: Dict<Element> = views.reduce(
    (d: Dict<Element>, e: Element) => {
      d[e.tag] = e;
      return d;
    }, {});
  let elementFromTemplate = createElementFromTemplate(dict);

  function initer(e: (m: any) => RenderedElement) {
    let container: any = document.getElementById(target);
    emce.subscribe(m => {
      container = patch(container, toSnabbdomNode(e(m)) as VNode);
    });
  }

  initer(elementFromTemplate(dict[elm].element));
}
