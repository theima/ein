
import { VNode } from 'snabbdom/vnode';
import { Dict, NullableValue } from '../../../core';

export interface PropertyChangeVNode extends VNode {
  propertyChange: (props: Dict<NullableValue>) => void;
}
