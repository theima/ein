import { Observable } from 'rxjs';
import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { isDestroyVNode } from '../functions/type-guards/is-destroy-v-node';
import { isEinVNode } from '../functions/type-guards/is-ein-v-node';
import { isExtendedVNode } from '../functions/type-guards/is-extended-v-node';
import { isPropertyChangeVNode } from '../functions/type-guards/is-property-change-v-node';
import { isStreamVNode } from '../functions/type-guards/is-stream-v-node';
import { mutateWithDestroy } from './mutate-with-destroy';
import { mutateWithPropertyChange } from './mutate-with-property-change';

export function extendedModule(renderer: (node: VNode, stream: Observable<VNode>) => void): Module {
  return {
    create: (empty: VNode, vNode: VNode) => {
      let contentStream;
      if (isExtendedVNode(vNode)) {
        const element: Element = vNode.elm as any;
        const result = vNode.init(element);
        contentStream = result.content;
        mutateWithDestroy(vNode, result.destroy);
        mutateWithPropertyChange(vNode, result.propertyChange);
      }
      if (isStreamVNode(vNode)) {
        contentStream = vNode.contentStream;
      }
      if (contentStream) {
        renderer(vNode, contentStream);
      }
    },
    update: (old: VNode, newVNode: VNode) => {
      // We need to mutate to ensure we keep the added properties.
      if (isDestroyVNode(old)) {
        mutateWithDestroy(newVNode, old.destroy);
      }
      if (isPropertyChangeVNode(old)) {
        mutateWithPropertyChange(newVNode, old.propertyChange);
      }
      if (isEinVNode(newVNode) && isPropertyChangeVNode(newVNode)) {
        newVNode.propertyChange(newVNode.properties);
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
