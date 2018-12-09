import { Element } from '../../view/types-and-interfaces/elements/element';
import { VNode } from 'snabbdom/vnode';
import { h } from 'snabbdom';
import { nativeElementsToNativeElementHolderList } from './native-elements-to-natitive-element-holder-list';
import { partial } from '../../core/functions/partial';
import { elementLookup } from './element-lookup';
import { arrayToDict } from '../../core/functions/array-to-dict';
import { Dict, get } from '../../core';
import { isLiveElement } from '../../view/functions/is-live-element';
import { give } from '../../core/functions/give';
import { snabbdomRenderer } from './snabbdom-renderer';
import { map } from 'rxjs/operators';
import { isStaticElement } from '../../view/functions/is-static-element';

export function createElementToVnode(): (element: Element) => VNode {
  let elements: Dict<{ element: Element, node: VNode }> = {};
  const elementToVNode = (element: Element) => {
    const old: { element: Element, node: VNode } | null = get(elements, element.id);
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
    const eventHandlers = element.eventHandlers;
    if (eventHandlers) {
      data.on = arrayToDict(h => h.handler, 'for', eventHandlers);
    }
    if (isLiveElement(element)) {
      data.hook = {
        insert: (n: VNode) => {
          snabbdomRenderer(n, element.childStream.pipe(map(
            (streamedChildren: Array<Element | string>) => {
              const children = streamedChildren.map(c => typeof c === 'object' ? elementToVNode(c) : c);
              return h(element.name, data, children as any);
            }
          )));
        }

      };

      const setElementLookup = element.setElementLookup;
      if (setElementLookup) {
        setTimeout(() => {
          const nativeElements = node.elm ? nativeElementsToNativeElementHolderList([node.elm as any]) : [];
          const lookup = partial(elementLookup, nativeElements);
          setElementLookup(lookup);
        }, 0);
      }
    }

    const children = isStaticElement(element) ? element.content.map(c => typeof c === 'object' ? elementToVNode(c) : c): [];
    let node: VNode = h(element.name, data, children as any[]);

    elements = give(elements, {element, node}, element.id);
    //strömmen ska unsubscribas på destroy.
    //id ska bort från dict on destroy.
    return node;
  };
  return elementToVNode;
}
