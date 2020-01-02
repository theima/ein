
import { Dict, NullableValue } from '../../../core';
import { EinVNode } from './ein-v-node';

export interface PropertyChangeVNode extends EinVNode {
  propertyChange: (props: Dict<NullableValue>) => void;
}
