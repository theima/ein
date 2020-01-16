import { Observable } from 'rxjs';
import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { partial } from '../../core';
import { initComponent } from '../functions/component/init-component';
import { initExtenders } from '../functions/init-extenders';
import { mutateWithDestroy } from '../functions/mutate-with-destroy';
import { mutateWithPropertyChange } from '../functions/mutate-with-property-change';
import { isDestroyVNode } from '../functions/type-guards/is-destroy-v-node';
import { isPropertyChangeVNode } from '../functions/type-guards/is-property-change-v-node';
import { ComponentDescriptor } from '../types-and-interfaces/component.descriptor';
import { EinVNodeData } from '../types-and-interfaces/ein-v-node-data';
import { ExtendVNodeResult } from '../types-and-interfaces/extend-v-node-result';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { NativeElement } from '../types-and-interfaces/native-element';

export function extendedModule(components: ComponentDescriptor[],
                               extenders: ExtenderDescriptor[],
                               renderer: (node: VNode, stream: Observable<VNode>, isContentUpdate: boolean) => void): Module {
  return {
    create: (empty: VNode, vNode: VNode) => {
      let contentStream;
      let init: undefined | ((e: NativeElement) => ExtendVNodeResult);
      const data: EinVNodeData = vNode.data as any;
      const appliedExtenders: ExtenderDescriptor[] = extenders.filter((ext) => !!data.properties[ext.name]);
      if (appliedExtenders.length) {
        init = partial(initExtenders, data.properties, appliedExtenders);
      }
      let c: ComponentDescriptor | undefined = components.find((c) => c.name === vNode.sel);
      if (c) {
        const component: ComponentDescriptor = c;
        init = partial(initComponent, data.key as any, component, data.properties);
      }
      if (init) {
        const element: NativeElement = vNode.elm as any;
        const result = init(element);
        contentStream = result.content;
        mutateWithDestroy(vNode, result.destroy);
        mutateWithPropertyChange(vNode, result.propertyChange);
      }
      if (data.elementStream) {
        contentStream = data.elementStream;
      }
      if (contentStream) {
        renderer(vNode, contentStream, true);
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
      if (isPropertyChangeVNode(newVNode) && newVNode.data!.properties) {
        newVNode.propertyChange(newVNode.data?.properties);
      }

    },
    destroy: (vNode: VNode) => {
      if (isDestroyVNode(vNode)) {
        vNode.destroy();
      }
    }
  } as any;
}
