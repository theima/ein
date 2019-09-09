import { VNode } from 'snabbdom/vnode';
import { Property } from '../../../view/types-and-interfaces/property';

export interface ExtendableVNode extends VNode {
  extendable: true;
  properties: Property[];
}
