import { Observable } from 'rxjs';
import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { isDestroyVNode } from '../functions/type-guards/is-destroy-v-node';
import { isExtendedVNode } from '../functions/type-guards/is-extended-v-node';
import { isStreamVNode } from '../functions/type-guards/is-stream-v-node';
import { DestroyVNode } from '../types-and-interfaces/v-node/destroy-v-node';

export function extendedModule(renderer: (node: VNode, stream: Observable<VNode>) => void): Module {
  return {
    create: (empty: VNode, vNode: VNode) => {
      let contentStream;
      if (isExtendedVNode(vNode)) {
        const element: Element = vNode.elm as any;
        const result = vNode.init(element);
        contentStream = result.content;
        const destroyVnode: DestroyVNode = vNode as any;
        destroyVnode.destroy = result.destroy;
      }
      if (isStreamVNode(vNode)) {
        contentStream = vNode.contentStream;
      }
      if (contentStream) {
        renderer(vNode, contentStream);
      }
    },
    update:(old: VNode, newVNode: VNode) => {
      if(isExtendedVNode(newVNode)) {
        // tslint:disable-next-line: no-console
        console.log(newVNode);
      }
    },
    destroy: (vNode: VNode) => {
      if (isDestroyVNode(vNode)) {
        vNode.destroy();
      }
    }
  } as any;
}
