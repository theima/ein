import { Observable } from 'rxjs';
import { isArray } from 'rxjs/internal/util/isArray';
import { map } from 'rxjs/operators';
import { VNode } from 'snabbdom/vnode';
import { Dict } from '../../core';
import { arrayToDict } from '../../core/functions/array-to-dict';
import { fromDict } from '../../core/functions/from-dict';
import { give } from '../../core/functions/give';
import { isLiveElement } from '../../view/functions/type-guards/is-live-element';
import { isStaticElement } from '../../view/functions/type-guards/is-static-element';
import { Element } from '../../view/types-and-interfaces/elements/element';
import { EinVNode } from '../types-and-interfaces/v-node/ein-v-node';
import { ExtendedVNode } from '../types-and-interfaces/v-node/extended-v-node';
import { StreamVNode } from '../types-and-interfaces/v-node/stream-v-node';
import { createVNode } from './create-v-node';

export function createElementToVNode(): (element: Element) => VNode {
  let elements: Dict<{ element: Element, node: VNode }> = {};
  const elementToVNode = (element: Element) => {
    const existing: { element: Element, node: VNode } | null = fromDict(elements, element.id);
    let init = null;
    let liveStream: Observable<Element | Array<Element | string>> | null = null;
    let stream: Observable<VNode> | null = null;
    let data: any = {
      attrs: arrayToDict((a) => a.value, 'name', element.properties),
      key: element.id
    };
    const handlers = element.handlers;
    if (handlers) {
      data.on = arrayToDict((h) => h.handler, 'for', handlers);
    }

    if (existing) {
      let oldElement = existing.element;
      const unchanged = oldElement === element;
      if (unchanged) {
        return existing.node;
      }
    } else {
      if (isLiveElement(element)) {
        liveStream = element.elementStream;
      }
    }

    const children = isStaticElement(element) ? element.content.map((c) => typeof c === 'object' ? elementToVNode(c) : c) : [];
    let vNode: VNode = createVNode(element.name, data, children);
    if (liveStream) {
      stream = liveStream.pipe(map(
        (item: Element | Array<Element | string>) => {
          if (isArray(item)) {
            const children = item.map((c) => typeof c === 'object' ? elementToVNode(c) : c);
            return createVNode(element.name, data, children);
          }
          return elementToVNode(item);
        }
      ));
    }
    if (init) {
      const extended = vNode as ExtendedVNode;
      extended.init = init;
    }
    if (stream) {
      const extended = vNode as StreamVNode;
      extended.contentStream = stream;
    }
    const p = vNode as EinVNode;
    p.properties = element.properties;
    elements = give(elements, { element, node: vNode }, element.id);
    return vNode;
  };
  return elementToVNode;
}
