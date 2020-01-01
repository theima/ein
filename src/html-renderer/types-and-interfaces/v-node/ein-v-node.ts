import { VNode } from 'snabbdom/vnode';
import { Property } from '../../../view/types-and-interfaces/property';

export interface EinVNode extends VNode {
  properties: Property[];
}
