import { Module } from 'snabbdom/modules/module';
import { ComponentDescriptor } from '../types-and-interfaces/component.descriptor';
import { VNode } from 'snabbdom/vnode';
import { ExtendedVNode } from '../types-and-interfaces/extended-v-node';
import { Property } from '../../view/types-and-interfaces/property';

export function componentModule(components: ComponentDescriptor[]): Module {
  const create = (emptyVNode: VNode, vNode: VNode) => {
    const element: Element = vNode.elm as any;
    if (element) {
      const component: ComponentDescriptor | undefined = components.find(c => element.tagName.toLowerCase() === c.name);
      if (component) {
        const result = component.init(element, null as any, null as any);
        let oldAttributes: Property[] | null = null;
        (vNode as ExtendedVNode).executeExtend = (newAttributes: Property[]) => {
          oldAttributes = newAttributes;
          if (oldAttributes) {
            //
          }
        };
        (vNode as ExtendedVNode).destroy = () => {
          if (result.onBeforeDestroy) {
            result.onBeforeDestroy();
          }
        };
      }
    }

  };
  return {
    create
  } as any;
}
