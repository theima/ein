import { VNode } from 'snabbdom/vnode';
import { Attribute } from '../../view/types-and-interfaces/attribute';

export interface ExtendedVNode extends VNode {
  executeExtend: (attrs: Attribute[]) => void;
  destroy: () => void;
}
