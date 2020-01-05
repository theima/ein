import { VNode } from 'snabbdom/vnode';
import { DestroyVNode } from '../../types-and-interfaces/v-node/destroy-v-node';

export function isDestroyVNode(vNode: VNode): vNode is DestroyVNode {
  return !!(vNode as DestroyVNode).destroy;
}
