import { VNode } from 'snabbdom/vnode';
import { Property } from '../../../view/types-and-interfaces/property';

export interface ExtendedVNode extends VNode {
  executeExtend: (attrs: Property[]) => void;
  destroy: () => void;
}
