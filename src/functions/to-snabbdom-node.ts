import {VNode} from 'snabbdom/vnode';
import {h} from 'snabbdom';
import {RenderedElement} from '../rendered-element';
import {Dict} from '../dict';

export function toSnabbdomNode(element: RenderedElement | string): VNode | string {
  if (typeof element === 'string') {
    return element;
  }
  let d: any = {};
  if (element.events) {
    let e: Dict<any> = {};
    e[element.events[0].name] = element.events[0].handler;
    d.on = e;
  }
  return h(element.tag, d, element.children.map((c: any) => toSnabbdomNode(c) as VNode));
}
