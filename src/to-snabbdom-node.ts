import { VNode } from 'snabbdom/vnode';
import { h } from 'snabbdom';
import { RenderedElement } from './rendered-element';
export function toSnabbdomNode(element: RenderedElement | string): VNode | string {
    if (typeof element === 'string') {
        return element;
    }
    return h(element.tag, element.children.map((c: any) => toSnabbdomNode(c)));
}
