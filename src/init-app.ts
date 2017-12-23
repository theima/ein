import { h } from 'snabbdom';
import { patch } from './patch';
import { Emce } from 'emce';
import { VNode } from 'snabbdom/vnode';
import { toSnabbdomNode } from './to-snabbdom-node';
import { elementFromTemplate } from './element-from-template';
import { TemplateElement } from './template-element';

export function initApp(target: string, emce: Emce<any>, elm: TemplateElement): void {
  function initer() {
    let container: any = document.getElementById(target);
    let mapper = elementFromTemplate(elm);
    emce.subscribe(m  => {
      let newC: VNode = toSnabbdomNode(elm) as VNode;
      /*
      let newC: VNode = h('div#container.replaced', elms.children.map((e => {
        if (typeof e !== 'string') {
          let dyn = getDynamic(e[1]);
          return h(e[0], {}, dyn(m));
        }
        let d = getDynamic(e);
        return d(m);
      })));
      */
      let count = 0;
      container = patch(container, toSnabbdomNode(mapper(m)) as VNode);
    });
  }
  initer();
}
