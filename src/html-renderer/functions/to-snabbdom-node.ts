import { VNode } from 'snabbdom/vnode';
import { h } from 'snabbdom';
import { Dict } from '../../core/types-and-interfaces/dict';
import { EventHandler } from '../../view/types-and-interfaces/event-handler';
import { Tag } from '../../view/types-and-interfaces/tag';
import { Property } from '../../view/index';

export function toSnabbdomNode(text: string): string;
export function toSnabbdomNode(tag: Tag, children: Array<VNode | string>, eventHandlers?: EventHandler[]): VNode;
export function toSnabbdomNode(tagOrText: Tag | string, children?: Array<VNode | string>, eventHandlers?: EventHandler[]): VNode | string {
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
  if (tagOrText.properties) {
    data.attrs = tagOrText.properties.reduce((d: Dict<any>, h: Property) => {
      d[h.name] = h.value;
      return d;
    }, {});
  }
  return h(tagOrText.name, data, children as any[]);
}
