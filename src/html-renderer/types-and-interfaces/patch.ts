import { VNode } from 'snabbdom/vnode';

export type Patch = (oldVnode: Element | VNode, vnode: VNode) => VNode;
