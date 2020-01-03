import { Observable, Subscription } from 'rxjs';
import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { partial } from '../../core';
import { initComponent } from '../functions/component/init-component';
import { initExtenders } from '../functions/init-extenders';
import { isDestroyVNode } from '../functions/type-guards/is-destroy-v-node';
import { isEinVNode } from '../functions/type-guards/is-ein-v-node';
import { isPropertyChangeVNode } from '../functions/type-guards/is-property-change-v-node';
import { isStreamVNode } from '../functions/type-guards/is-stream-v-node';
import { ComponentDescriptor } from '../types-and-interfaces/component.descriptor';
import { ExtendVNodeResult } from '../types-and-interfaces/extend-v-node-result';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { NativeElement } from '../types-and-interfaces/native-element';
import { mutateWithDestroy } from './mutate-with-destroy';
import { mutateWithPropertyChange } from './mutate-with-property-change';

export function extendedModule(components: ComponentDescriptor[],
                               extenders: ExtenderDescriptor[],
                               renderer: (node: VNode, stream: Observable<VNode>) => Subscription): Module {
  return {
    create: (empty: VNode, vNode: VNode) => {
      let contentStream;
      let init: undefined | ((e: NativeElement) => ExtendVNodeResult);
      if (isEinVNode(vNode)) {
        const appliedExtenders: ExtenderDescriptor[] = extenders.filter((ext) => !!vNode.properties[ext.name]);
        if (appliedExtenders.length) {
          init = partial(initExtenders, vNode.properties, appliedExtenders);
        }
        let c: ComponentDescriptor | undefined = components.find((c) => c.name === vNode.sel);
        if (c) {
          const component: ComponentDescriptor = c;
          const key = vNode.data?.key as string || '';
          init = partial(initComponent, key, component, vNode.properties);
        }
      }
      if (init) {
        const element: NativeElement = vNode.elm as any;
        const result = init(element);
        contentStream = result.content;
        mutateWithDestroy(vNode, result.destroy);
        mutateWithPropertyChange(vNode, result.propertyChange);
      }
      if (isStreamVNode(vNode)) {
        contentStream = vNode.contentStream;
      }
      if (contentStream) {
        const subscription = renderer(vNode, contentStream);
        mutateWithDestroy(vNode, () => subscription.unsubscribe());
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
      }

    },
    destroy: (vNode: VNode) => {
      if (isDestroyVNode(vNode)) {
        vNode.destroy();
      }
    }
  } as any;
}
