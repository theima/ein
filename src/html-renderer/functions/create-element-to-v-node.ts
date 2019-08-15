import { Element } from '../../view/types-and-interfaces/elements/element';
import { VNode } from 'snabbdom/vnode';
import { h } from 'snabbdom';
import { arrayToDict } from '../../core/functions/array-to-dict';
import { Dict } from '../../core';
import { give } from '../../core/functions/give';
import { map } from 'rxjs/operators';
import { isStaticElement } from '../../view/functions/type-guards/is-static-element';
import { fromDict } from '../../core/functions/from-dict';
import { Patch } from '../types-and-interfaces/patch';
import { isExtendedVNode } from './type-guards/is-extended-v-node';
import { isLiveElement } from '../../view/functions/type-guards/is-live-element';
import { Observable } from 'rxjs';
import { initiateVNodeChildStream } from './initiate-v-node-child-stream';

export function createElementToVNode(patch: Patch): (element: Element) => VNode {
  let elements: Dict<{ element: Element, node: VNode }> = {};
  const elementToVNode = (element: Element) => {
    const old: { element: Element, node: VNode } | null = fromDict(elements, element.id);
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
    const extender = (old: VNode, n: VNode) => {
      if (isExtendedVNode(n)) {
        n.executeExtend(element.properties);
      }
    };
    const handlers = element.handlers;
    if (handlers) {
      data.on = arrayToDict(h => h.handler, 'for', handlers);
    }
    data.hook = {
      postpatch: extender,
      create: extender
    };

    if (isLiveElement(element)) {
      data.hook.insert = (n: VNode) => {
        const stream: Observable<VNode> = element.childStream.pipe(map(
          (streamedChildren: Array<Element | string>) => {
            const children = streamedChildren.map(c => typeof c === 'object' ? elementToVNode(c) : c);
            return h(element.name, data, children as any);
          }
        ));
        initiateVNodeChildStream(patch, n, stream);
      };
    }

    const children = isStaticElement(element) ? element.content.map(c => typeof c === 'object' ? elementToVNode(c) : c) : [];
    let node: VNode = h(element.name, data, children as any[]);

    elements = give(elements, { element, node }, element.id);
    return node;
  };
  return elementToVNode;
}
