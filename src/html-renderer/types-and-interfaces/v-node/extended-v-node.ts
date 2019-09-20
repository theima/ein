import { Property } from '../../../view/types-and-interfaces/property';
import { ExtendableVNode } from './extendable-v-node';

export interface ExtendedVNode extends ExtendableVNode {
  propertiesChanged: (props: Property[]) => void;
  init: (element: Element) => void;
  destroy: () => void;
}
