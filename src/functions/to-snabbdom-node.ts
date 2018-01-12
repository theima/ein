import {VNode} from 'snabbdom/vnode';
import {h} from 'snabbdom';
import {Dict} from '../types-and-interfaces/dict';
import {EventHandler} from '../types-and-interfaces/event-handler';
import {Element} from '../types-and-interfaces/element';
import {Tag} from '../types-and-interfaces/tag';
import {Attribute} from '../';
export function toSnabbdomNode(text: string): string;
export function toSnabbdomNode(tag: Tag, children: Array<Element | string>, eventHandlers?: EventHandler[]): VNode;
export function toSnabbdomNode(tagOrText: Tag | string, children?: Array<Element | string>, eventHandlers?: EventHandler[]): VNode | string {
  if (typeof tagOrText === 'string') {
    return tagOrText;
  }
  let data: any = {};
  if (eventHandlers) {
    data.on = eventHandlers.reduce((d: Dict<any>, h: EventHandler) => {
      d[h.for] = h.handler;
      return d;
    }, {});
  }
  if (tagOrText.attributes) {
    data.attrs = tagOrText.attributes.reduce((d: Dict<any>, h: Attribute) => {
      d[h.name] = h.value;
      return d;
    }, {});
  }
  return h(tagOrText.name, data, children as any[]);
}
