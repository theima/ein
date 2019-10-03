import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { isExtendedVNode } from '../functions/type-guards/is-extended-v-node';
import { isStreamVNode } from '../functions/type-guards/is-stream-v-node';
import { Observable } from 'rxjs';

export function extendedModule(renderer: (node: VNode, stream: Observable<VNode>) => void): Module {
  return {
    create: (empty: VNode, node: VNode) => {
      if (isExtendedVNode(node)) {
        const element: Element = node.elm as any;
        node.init(element);
      }
      if (isStreamVNode(node)) {
        renderer(node, node.contentStream);
      }
    },
    destroy: (vNode: VNode) => {
      if (isExtendedVNode(vNode)) {
        //vNode.destroy();
      }
    }
  } as any;
}
