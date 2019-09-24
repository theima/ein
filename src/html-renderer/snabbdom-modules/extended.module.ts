import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { ExtendedVNode } from '../types-and-interfaces/v-node/extended-v-node';
import { isExtendedVNode } from '../functions/type-guards/is-extended-v-node';
import { isStreamVNode } from '../functions/type-guards/is-stream-v-node';
import { Observable } from 'rxjs';
import { ExtendableVNode } from '../types-and-interfaces/v-node/extendable-v-node';

export function extendedModule(renderer: (node: VNode, stream: Observable<VNode>) => void): Module {
  return {
    create: (empty: VNode, node: ExtendableVNode) => {
      if (isExtendedVNode(node)) {
        const element: Element = node.elm as any;
        node.init(element);
      }
      if (isStreamVNode(node)) {
        renderer(node, node.contentStream);
      }
    },
    update: (old: VNode, vNode: VNode) => {
      if (isExtendedVNode(old)) {
        (vNode as ExtendedVNode).propertiesChanged = old.propertiesChanged;
      }
    },
    postPatch: (old: VNode, node: ExtendableVNode) => {
      if (isExtendedVNode(node)) {
        node.propertiesChanged(node.properties);
      }
    },
    destroy: (vNode: VNode) => {
      if (isExtendedVNode(vNode)) {
        //vNode.destroy();
      }
    }
  } as any;
}
