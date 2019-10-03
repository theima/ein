import { VNode } from 'snabbdom/vnode';

export interface ExtendedVNode extends VNode {
  init: (element: Element) => void;
}
