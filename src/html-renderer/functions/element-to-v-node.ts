
import { isArray } from 'rxjs/internal/util/isArray';
import { map } from 'rxjs/operators';
import { VNode } from 'snabbdom/vnode';
import { arrayToDict } from '../../core/functions/array-to-dict';
import { isLiveElement } from '../../view/functions/type-guards/is-live-element';
import { isStaticElement } from '../../view/functions/type-guards/is-static-element';
import { Element } from '../../view/types-and-interfaces/elements/element';
import { EinVNode } from '../types-and-interfaces/v-node/ein-v-node';
import { StreamVNode } from '../types-and-interfaces/v-node/stream-v-node';
import { createVNode } from './create-v-node';

export function elementToVNode(element: Element) {
    let data: any = {
      attrs: arrayToDict((a) => a.value, 'name', element.properties),
      key: element.id
    };
    const handlers = element.handlers;
    if (handlers) {
      data.on = arrayToDict((h) => h.handler, 'for', handlers);
    }
    const children = isStaticElement(element) ? element.content.map((c) => typeof c === 'object' ? elementToVNode(c) : c) : [];
    let vNode: VNode = createVNode(element.name, data, children);

    if (isLiveElement(element)) {
      const extended = vNode as StreamVNode;
      extended.contentStream = element.elementStream.pipe(map(
        (item: Element | Array<Element | string>) => {
          if (isArray(item)) {
            const children = item.map((c) => typeof c === 'object' ? elementToVNode(c) : c);
            return createVNode(element.name, data, children);
          }
          return elementToVNode(item);
        }
      ));
    }
    const p = vNode as EinVNode;
    p.properties = element.properties;
    return vNode;
  }
