import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { ExtendedVNode } from '../types-and-interfaces/extended-v-node';
import { Property } from '../../view/types-and-interfaces/property';
import { getProperty } from '../../view';
import { isExtendedVNode } from '../functions/type-guards/is-extended-v-node';
import { partial } from '../../core';

export function extenderModule(extenders: ExtenderDescriptor[]): Module {
  const create = (emptyVnode: VNode, vnode: VNode) => {
    const element: Element = vnode.elm as any;
    if (element) {
      const applied: ExtenderDescriptor[] = extenders.filter(ext => element.hasAttribute(ext.name));
      let oldAttributes: Property[] | null = null;
      if (applied.length) {
        const results = applied.map(e => e.initiateExtender(element));
        const updates = results.map(r => r.update);
        const destroys = results.map(r => {
          return r.onBeforeDestroy || (() => { });
        });
        (vnode as ExtendedVNode).executeExtend = (newAttributes: Property[]) => {
          updates.forEach((update, index) => {
            const getAttributeForExtender = partial(getProperty, applied[index].name);
            const newAttribute = getAttributeForExtender(newAttributes as any) as any;
            const newValue = newAttribute.value;
            let oldValue;
            if (oldAttributes) {
              const oldAttribute = getAttributeForExtender(oldAttributes as any);
              if (oldAttribute) {
                oldValue = oldAttribute.value;
              }
            }
            update(newValue, oldValue, newAttributes);
          });
          oldAttributes = newAttributes;
        };
        (vnode as ExtendedVNode).destroy = () => {
          destroys.forEach(d => d());
        };
      }
    }

  };
  const update = (old: VNode, vnode: VNode) => {
    if (isExtendedVNode(old)) {
      (vnode as ExtendedVNode).executeExtend = old.executeExtend;
    }
  };
  const destroy = (vnode: VNode) => {
    if (isExtendedVNode(vnode)) {
      vnode.destroy();
    }
  };
  return {
    create,
    update,
    destroy
  } as any;
}
