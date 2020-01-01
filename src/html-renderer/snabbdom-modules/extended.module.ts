import { Observable } from 'rxjs';
import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { isExtendedVNode } from '../functions/type-guards/is-extended-v-node';
import { isStreamVNode } from '../functions/type-guards/is-stream-v-node';

export function extendedModule(renderer: (node: VNode, stream: Observable<VNode>) => void): Module {
  return {
    create: (empty: VNode, vNode: VNode) => {
      if (isExtendedVNode(vNode)) {
        const element: Element = vNode.elm as any;
        vNode.init(element);
        (vNode as any).temp = 'sdi';
      }
      if (isStreamVNode(vNode)) {
        renderer(vNode, vNode.contentStream);
      }
    },
    update:(old: VNode, newVNode: VNode) => {
      if(isExtendedVNode(newVNode)) {
        // tslint:disable-next-line: no-console
        console.log(newVNode);
      }
    },
    destroy: (vNode: VNode) => {
      if (isExtendedVNode(vNode)) {
        vNode.destroy();
      }
    }
  } as any;
}
