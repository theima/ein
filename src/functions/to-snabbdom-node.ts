import {VNode} from 'snabbdom/vnode';
import {h} from 'snabbdom';
import {RenderedElement} from '../rendered-element';
import {Dict} from '../types-and-interfaces/dict';

export function toSnabbdomNode(element: RenderedElement | string): VNode | string {
  if (typeof element === 'string') {
    return element;
  }
  let d: any = {};
  if (element.eventsHandlers) {
    let e: Dict<any> = {};
    e[element.eventsHandlers[0].for] = element.eventsHandlers[0].handler;
    d.on = e;
  }
  return h(element.tag, d, element.children.map((c: any) => toSnabbdomNode(c) as VNode));
}
