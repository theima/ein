import { VNode } from 'snabbdom/vnode';
import { Dict, NullableValue } from '../../core';
import { PropertyChangeVNode } from '../types-and-interfaces/v-node/property-change-v-node';

export function mutateWithPropertyChange(vNode: VNode, propertyChange: (props: Dict<NullableValue>) => void): void {
  const propertyChangeVNode: PropertyChangeVNode = vNode as any;
  propertyChangeVNode.propertyChange = propertyChange;
}
