import { VNode } from 'snabbdom/vnode';

export function isVNode(item: HTMLElement | VNode): item is VNode {
  return !!(item as VNode).sel;
}
