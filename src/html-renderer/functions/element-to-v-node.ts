import { Element } from '../../view/types-and-interfaces/element';
import { VNode } from 'snabbdom/vnode';
import { h } from 'snabbdom';
import { Dict } from '../../core';
import { EventHandler } from '../../view';
import { Attribute } from '../../view/types-and-interfaces/attribute';

export function elementToVNode(element: Element): VNode {
  const toVnode: (e: Element) => VNode = (element: Element) => {
    let data: any = {};
    const eventHandlers = element.eventHandlers;
    if (eventHandlers) {
      data.on = eventHandlers.reduce((d: Dict<any>, h: EventHandler) => {
        d[h.for] = h.handler;
        return d;
      }, {});
    }
    data.attrs = element.attributes.reduce((d: Dict<any>, h: Attribute) => {
      d[h.name] = h.value;
      return d;
    }, {});
    const children = element.content.map(
      c => {
        if (typeof c === 'object') {
          return toVnode(c);
        }
        return c;
      }
    );
    return h(element.name, data, children as any[]);
  };

  return toVnode(element);
}
