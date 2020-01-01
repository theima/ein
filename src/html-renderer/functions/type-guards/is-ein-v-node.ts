import { VNode } from 'snabbdom/vnode';
import { EinVNode } from '../../types-and-interfaces/v-node/ein-v-node';

export function isEinVNode(vNode: VNode): vNode is EinVNode {
  return !!(vNode as EinVNode).properties;
}
