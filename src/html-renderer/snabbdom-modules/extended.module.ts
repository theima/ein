import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { ExtendedVNode } from '../types-and-interfaces/extended-v-node';
import { isExtendedVNode } from '../functions/type-guards/is-extended-v-node';

export const extendedModule: Module = {
    update: (old: VNode, vNode: VNode) => {
      if (isExtendedVNode(old)) {
        (vNode as ExtendedVNode).executeExtend = old.executeExtend;
      }
    },
    destroy: (vNode: VNode) => {
      if (isExtendedVNode(vNode)) {
        vNode.destroy();
      }
    }
} as any;
