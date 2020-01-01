import { VNode } from 'snabbdom/vnode';
import { Property } from '../../view/types-and-interfaces/property';
import { PropertyChangeVNode } from '../types-and-interfaces/v-node/property-change-v-node';

export function mutateWithPropertyChange(vNode: VNode, propertyChange: (props: Property[]) => void): void {
  const propertyChangeVNode: PropertyChangeVNode = vNode as any;
  propertyChangeVNode.propertyChange = propertyChange;
}
