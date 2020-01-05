import { h } from 'snabbdom';
import { VNode } from 'snabbdom/vnode';

export function createVNode(sel: string, data: {}, children: Array<string | VNode>): VNode {
  return  h(sel, data, children) as any;
}
