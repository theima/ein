import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { ExtendedVNode } from '../types-and-interfaces/extended-v-node';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { getAttribute } from '../../view';
import { isExtendedVNode } from '../functions/type-guards/is-extended-v-node';

export function extenderModule(extenders: ExtenderDescriptor[]): Module {
  const create = (emptyVnode: VNode, vnode: VNode) => {
    const element: Element = vnode.elm as any;
    if (element) {
      const applied: ExtenderDescriptor[] = extenders.filter(ext => element.hasAttribute(ext.name));
      let oldAttributes: Attribute[] | null = null;
      if (applied.length) {
        const results = applied.map(e => e.initiateExtender());
        const updates = results.map(r => r.update);
        /*const destroys = results.map(r => {
          return r.onBeforeDestroy || (() => {});
        });*/
        (vnode as ExtendedVNode).executeExtend = (newAttributes: Attribute[]) => {
          updates.forEach((update, index) => {
            const newAttribute = getAttribute(newAttributes, applied[index].name) as any;
            const newValue = newAttribute.value;
            let oldValue;
            if (oldAttributes) {
              const oldAttribute = getAttribute(oldAttributes, applied[index].name);
              if (oldAttribute) {
                oldValue = oldAttribute.value;
              }
            }
            update(element, newValue, oldValue, newAttributes);
          });
          oldAttributes = newAttributes;
        };
      }
    }

  };
  const update = (old: VNode, vnode: VNode) => {
    if (isExtendedVNode(old)) {
      (vnode as ExtendedVNode).executeExtend = old.executeExtend;
    }
  };
  return {
    create,
    update
  } as any;
}
