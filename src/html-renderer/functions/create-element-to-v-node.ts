import { Element } from '../../view/types-and-interfaces/elements/element';
import { VNode } from 'snabbdom/vnode';
import { arrayToDict } from '../../core/functions/array-to-dict';
import { Dict } from '../../core';
import { give } from '../../core/functions/give';
import { isStaticElement } from '../../view/functions/type-guards/is-static-element';
import { fromDict } from '../../core/functions/from-dict';
import { Patch } from '../types-and-interfaces/patch';
import { isLiveElement } from '../../view/functions/type-guards/is-live-element';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StreamVNode } from '../types-and-interfaces/v-node/stream-v-node';
import { ExtendableVNode } from '../types-and-interfaces/v-node/extendable-v-node';
import { createVNode } from './create-v-node';

export function createElementToVNode(patch: Patch): (element: Element) => ExtendableVNode {
  let elements: Dict<{ element: Element, node: ExtendableVNode }> = {};
  const elementToVNode = (element: Element) => {
    const old: { element: Element, node: ExtendableVNode } | null = fromDict(elements, element.id);
    let oldElement;
    if (old) {
      oldElement = old.element;
      if (oldElement === element) {
        return old.node;
      }
    }

    let data: any = {
      attrs: arrayToDict(a => a.value, 'name', element.properties),
      key: element.id
    };
    const handlers = element.handlers;
    if (handlers) {
      data.on = arrayToDict(h => h.handler, 'for', handlers);
    }

    const children = isStaticElement(element) ? element.content.map(c => typeof c === 'object' ? elementToVNode(c) : c) : [];
    let node: ExtendableVNode = createVNode(element, data, children);
    if (isLiveElement(element)) {
      const stream: Observable<VNode> = element.childStream.pipe(map(
          (streamedChildren: Array<Element | string>) => {
            const children = streamedChildren.map(c => typeof c === 'object' ? elementToVNode(c) : c);
            return createVNode(element, data, children);
          }
        ));
      const extended = node as StreamVNode;
      extended.contentStream = stream;
    }
    elements = give(elements, { element, node }, element.id);
    return node;
  };
  return elementToVNode;
}
