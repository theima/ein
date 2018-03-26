import { RenderInfo } from '../../view/types-and-interfaces/render-info';
import { VNode } from 'snabbdom/vnode';
import { h } from 'snabbdom';
import { Dict } from '../../core';
import { EventHandler, Property } from '../../view';

export function renderInfoToVNode(renderInfo: RenderInfo): VNode {
  const toVnode: (i: RenderInfo) => VNode = (info: RenderInfo) => {
    let data: any = {};
    const eventHandlers = info.eventHandlers;
    if (eventHandlers) {
      data.on = eventHandlers.reduce((d: Dict<any>, h: EventHandler) => {
        d[h.for] = h.handler;
        return d;
      }, {});
    }
    data.attrs = info.properties.reduce((d: Dict<any>, h: Property) => {
      d[h.name] = h.value + '';
      return d;
    }, {});
    const children = info.content.map(
      c => {
        if (typeof c === 'object') {
          return toVnode(c);
        }
        return c;
      }
    );
    return h(info.name, data, children as any[]);
  };

  return toVnode(renderInfo);
}
