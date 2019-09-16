import { VNode } from 'snabbdom/vnode';
import { ExtendedVNode } from '../../types-and-interfaces/v-node/extended-v-node';

export function isExtendedVNode(vNode: VNode): vNode is ExtendedVNode {
  return !!(vNode as ExtendedVNode).propertiesChanged;
}
