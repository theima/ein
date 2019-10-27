import { h } from 'snabbdom';
import { VNode } from 'snabbdom/vnode';
import { Element } from '../../view';

export function createVNode(element: Element, data: {}, children: Array<string | VNode>): VNode {
  return  h(element.name, data, children) as any;
}
