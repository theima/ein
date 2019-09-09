import { Property } from '../../../view/types-and-interfaces/property';
import { ExtendableVNode } from './extendable-v-node';

export interface ExtendedVNode extends ExtendableVNode {
  executeExtend: (attrs: Property[]) => void;
  destroy: () => void;
}
