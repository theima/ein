import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { ExtendedVNode } from '../types-and-interfaces/extended-v-node';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { getAttribute } from '../../view';

export function extenderModule(extenders: ExtenderDescriptor[]): Module {
  const create = (emptyVnode: VNode, vnode: VNode) => {
    const element: Element = vnode.elm as any;
    if (element) {
      const applied: ExtenderDescriptor[] = extenders.filter(ext => element.hasAttribute(ext.name));
      let oldAttributes: Attribute[] | null = null;
      if (applied.length) {
        (vnode as ExtendedVNode).executeExtend = (newAttributes: Attribute[]) => {
          applied.forEach((e, index) => {
            const newAttribute = getAttribute(newAttributes, applied[index].name);
            let oldAttribute;
            if (oldAttributes) {
              oldAttribute = getAttribute(oldAttributes, applied[index].name);
            }
            e.extender(element, newAttribute, oldAttribute, newAttributes);
          });
          oldAttributes = newAttributes;
        };
      }
    }

  };
  return {
    create
  } as any;
}
