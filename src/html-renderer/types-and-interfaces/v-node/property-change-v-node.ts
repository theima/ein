import { Property } from '../../../view/types-and-interfaces/property';
import { EinVNode } from './ein-v-node';

export interface PropertyChangeVNode extends EinVNode {
  propertyChange: (props: Property[]) => void;
}
