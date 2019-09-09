import { VNode } from 'snabbdom/vnode';
import { ExtendableVNode } from '../../types-and-interfaces/v-node/extendable-v-node';

export function isExtendableVNode(vNode: VNode): vNode is ExtendableVNode {
  return (vNode as ExtendableVNode).extendable;
}
