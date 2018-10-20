import { Element } from '../../view/types-and-interfaces/element';
import { VNode } from 'snabbdom/vnode';
import { h } from 'snabbdom';
import { nativeElementsToNativeElementHolderList } from './native-elements-to-natitive-element-holder-list';
import { partial } from '../../core/functions/partial';
import { elementLookup } from './element-lookup';
import { arrayToDict } from '../../core/functions/array-to-dict';

export function elementToVNode(element: Element): VNode {
  const toVnode: (e: Element) => VNode = (element: Element) => {
    let data: any = {};
    const eventHandlers = element.eventHandlers;
    if (eventHandlers) {
      data.on = arrayToDict(h => h.handler, 'for', eventHandlers);
    }
    data.attrs = arrayToDict(a => a.value, 'name', element.attributes);
    const children = element.content.map(c => typeof c === 'object' ? toVnode(c) : c);
    const vnode = h(element.name, data, children as any[]);
    const setElementLookup = element.setElementLookup;
    if (setElementLookup) {
      //tslint:disable-next-line
      console.log(element);
      setTimeout(() => {
        const nativeElements = vnode.elm ? nativeElementsToNativeElementHolderList([vnode.elm as any]) : [];
        const lookup = partial(elementLookup, nativeElements);
        setElementLookup(lookup);
      }, 0);
    }
    return vnode;
  };

  return toVnode(element);
}
