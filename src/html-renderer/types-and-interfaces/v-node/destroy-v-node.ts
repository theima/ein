import { VNode } from 'snabbdom/vnode';

export interface DestroyVNode extends VNode {
  destroy: () => void;
}
