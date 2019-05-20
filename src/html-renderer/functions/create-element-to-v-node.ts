import { Element } from '../../view/types-and-interfaces/elements/element';
import { VNode } from 'snabbdom/vnode';
import { h } from 'snabbdom';
import { nativeElementsToNativeElementHolderList } from './native-elements-to-natitive-element-holder-list';
import { partial } from '../../core/functions/partial';
import { elementLookup } from './element-lookup';
import { arrayToDict } from '../../core/functions/array-to-dict';
import { Dict } from '../../core';
import { give } from '../../core/functions/give';
import { snabbdomRenderer } from './snabbdom-renderer';
import { map } from 'rxjs/operators';
import { isStaticElement } from '../../view/functions/type-guards/is-static-element';
import { fromDict } from '../../core/functions/from-dict';
import { Patch } from '../types-and-interfaces/patch';
import { isExtendedVNode } from './type-guards/is-extended-v-node';
import { isLiveElement } from '../../view/functions/type-guards/is-live-element';
import { isComponentElement } from './type-guards/is-component-element';

export function createElementToVnode(patch: Patch): (element: Element) => VNode {
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
      attrs: arrayToDict(a => a.value, 'name', element.attributes),
      key: element.id
    };
    const extender = (old: VNode, n: VNode) => {
      if (isExtendedVNode(n)) {
        n.executeExtend(element.attributes);
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
    if (isComponentElement(element)) {
      const setElementLookup = element.setElementLookup;
      const updateNativeElement = (elm?: any) => {
        if (setElementLookup) {
          const nativeElements = elm ? nativeElementsToNativeElementHolderList([elm]) : [];
          const lookup = partial(elementLookup, nativeElements);
          setElementLookup(lookup);
        }
      };
      data.hook = {
        insert: (n: VNode) => {
          snabbdomRenderer(patch, n, element.childStream.pipe(map(
            (streamedChildren: Array<Element | string>) => {
              const children = streamedChildren.map(c => typeof c === 'object' ? elementToVNode(c) : c);
              return h(element.name, data, children as any);
            }
          )));
        },
        postpatch: (old: VNode, n: VNode) => {
          updateNativeElement(n.elm);
          extender(old, n);
        }

      };
    } else if (isLiveElement(element)) {
      data.hook.insert = (n: VNode) => {
        snabbdomRenderer(patch, n, element.childStream.pipe(map(
          (streamedChildren: Array<Element | string>) => {
            const children = streamedChildren.map(c => typeof c === 'object' ? elementToVNode(c) : c);
            return h(element.name, data, children as any);
          }
        )));
      };
    }

    const children = isStaticElement(element) ? element.content.map(c => typeof c === 'object' ? elementToVNode(c) : c) : [];
    let node: VNode = h(element.name, data, children as any[]);

    elements = give(elements, { element, node }, element.id);
    return node;
  };
  return elementToVNode;
}
