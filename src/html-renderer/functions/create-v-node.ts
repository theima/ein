import { VNode } from 'snabbdom/vnode';
import { Element } from '../../view';
import { h } from 'snabbdom';

export function createVNode(element: Element, data: {}, children: Array<string | VNode>): VNode {
  return  h(element.name, data, children) as any;
}
