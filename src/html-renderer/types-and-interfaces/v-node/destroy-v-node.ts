
import { EinVNode } from './ein-v-node';

export interface DestroyVNode extends EinVNode {
  destroy: () => void;
}
