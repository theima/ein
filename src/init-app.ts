import {patch} from './patch';
import {Emce} from 'emce';
import {VNode} from 'snabbdom/vnode';
import {toSnabbdomNode} from './functions/to-snabbdom-node';
import {createElementFromTemplate} from './functions/create-element-from-template';
import {RenderedElement} from './rendered-element';
import {Dict} from './types-and-interfaces/dict';
import {Element} from './element';
import {TemplateElement} from './template-element';

export function initApp(target: string, emce: Emce<any>, elm: string, views: Element[]): void {
  let dict: Dict<TemplateElement> = views.reduce(
    (d: Dict<TemplateElement>, e: Element) => {
      d[e.tag] = e.element;
      return d;
    }, {});
  let elementFromTemplate = createElementFromTemplate(dict);

  function initer(e: (m: any) => RenderedElement) {
    let container: any = document.getElementById(target);
    emce.subscribe(m => {
      container = patch(container, toSnabbdomNode(e(m)) as VNode);
    });
  }

  initer(elementFromTemplate(dict[elm]));
}
