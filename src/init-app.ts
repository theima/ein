import {patch} from './patch';
import {Emce} from 'emce';
import {VNode} from 'snabbdom/vnode';
import {toSnabbdomNode} from './functions/to-snabbdom-node';
import {createElementFromTemplate} from './functions/create-element-from-template';
import {TemplateElement} from './template-element';
import {RenderedElement} from './rendered-element';
import {Dict} from './dict';
import {Element} from './element';

export function initApp(target: string, emce: Emce<any>, elm: TemplateElement, views: Element[]): void {
  let dict: Dict<(m: any) => RenderedElement> = {};
  let getter = (key: string) => {
    return dict[key] as (m: any) => RenderedElement;
  };
  let elementFromTemplate = createElementFromTemplate(getter);
  dict = views.reduce(
    (d: Dict<(m: any) => RenderedElement>, e: Element) => {
      d[e.tag] = elementFromTemplate(e.element);
      return d;
    }, dict);
  /*
  dict.view = elementFromTemplate({
    tag: 'view',
    children: ['viewer {{value}}']
  });
  */
  function initer() {
    let container: any = document.getElementById(target);
    let mapper = elementFromTemplate(elm);
    emce.subscribe(m => {
      container = patch(container, toSnabbdomNode(mapper(m)) as VNode);
    });
  }

  initer();
}
