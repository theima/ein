import { VNode } from 'snabbdom/vnode';
import { PropertyChangeVNode } from '../../types-and-interfaces/v-node/property-change-v-node';

export function isPropertyChangeVNode(vNode: VNode): vNode is PropertyChangeVNode {
  return !!(vNode as PropertyChangeVNode).propertyChange;
}
