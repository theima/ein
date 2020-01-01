import { Property } from '../../../view/types-and-interfaces/property';
import { ExtendedVNode } from './extended-v-node';

export interface PropertyChangeVNode extends ExtendedVNode {
  propertyChange: (props: Property[]) => void;
}
