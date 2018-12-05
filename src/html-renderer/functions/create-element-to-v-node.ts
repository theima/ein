import { Element } from '../../view/types-and-interfaces/element';
import { VNode } from 'snabbdom/vnode';
import { h } from 'snabbdom';
import { nativeElementsToNativeElementHolderList } from './native-elements-to-natitive-element-holder-list';
import { partial } from '../../core/functions/partial';
import { elementLookup } from './element-lookup';
import { arrayToDict } from '../../core/functions/array-to-dict';
import { Dict, get } from '../../core';
import { isLiveElement } from '../../view/functions/is-live-element';
import { give } from '../../core/functions/give';

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

    let data: any = {};
    const eventHandlers = element.eventHandlers;
    if (eventHandlers) {
      data.on = arrayToDict(h => h.handler, 'for', eventHandlers);
    }
    data.attrs = arrayToDict(a => a.value, 'name', element.attributes);
    const children = element.content.map(c => typeof c === 'object' ? elementToVNode(c) : c);
    const node: VNode = h(element.name, data, children as any[]);

    elements = give(elements,{element,node},element.id);
    if (isLiveElement(element)) {
      //subscribe to stream...
      let stream = isLiveElement(oldElement) ? oldElement.childStream : null;
      if (element.childStream !== stream) {
        element.childStream.subscribe((es: any) => {
            //tslint:disable-next-line
            console.log('child-stream');
            //tslint:disable-next-line
            console.log(es);
          }, () => {
            /**/
          },
          () => {
            //tslint:disable-next-line
            console.log('completed.');
          });
      }
      const setElementLookup = element.setElementLookup;
      if (setElementLookup) {
        setTimeout(() => {
          const nativeElements = node.elm ? nativeElementsToNativeElementHolderList([node.elm as any]) : [];
          const lookup = partial(elementLookup, nativeElements);
          setElementLookup(lookup);
        }, 0);
      }
    }
    //strömmen ska unsubscribas på destroy.
    //id ska bort från dict on destroy.
    return node;
  };
  return elementToVNode;
}
