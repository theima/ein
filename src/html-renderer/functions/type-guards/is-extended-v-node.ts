import { VNode } from 'snabbdom/vnode';
import { ExtendedVNode } from '../../types-and-interfaces/extended-v-node';

export function isExtendedVNode(vnode: VNode): vnode is ExtendedVNode {
  return !!(vnode as ExtendedVNode).executeExtend;
}
