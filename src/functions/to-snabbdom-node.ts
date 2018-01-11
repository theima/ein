import {VNode} from 'snabbdom/vnode';
import {h} from 'snabbdom';
import {Dict} from '../types-and-interfaces/dict';
import {EventHandler} from '../types-and-interfaces/event-handler';
import {Element} from '../types-and-interfaces/element';
export function toSnabbdomNode(text: string): string;
export function toSnabbdomNode(tag: string, children: Array<Element | string>, eventHandlers?: EventHandler[]): VNode;
export function toSnabbdomNode(tagOrText: string, children?: Array<Element | string>, eventHandlers?: EventHandler[]): VNode | string {
  if (arguments.length === 1) {
    return tagOrText;
  }
  let d: any = {};
  if (eventHandlers) {
    let e: Dict<any> = {};
    e[eventHandlers[0].for] = eventHandlers[0].handler;
    d.on = e;
  }
  return h(tagOrText, d, children as any[]);
}
