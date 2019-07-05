import { VNode } from 'snabbdom/vnode';
import { ExtendedVNode } from '../../types-and-interfaces/extended-v-node';

export function isExtendedVNode(vNode: VNode): vNode is ExtendedVNode {
  return !!(vNode as ExtendedVNode).executeExtend;
}
