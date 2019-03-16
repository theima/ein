import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { arrayToDict, fromDict } from '../../core';

export function extenderModule(extenders: ExtenderDescriptor[]): Module {
  const all = arrayToDict('name', extenders);
  const create = (oldVnode: VNode, vnode: VNode) => {
    const element: Element = vnode.elm as any;
    if (element) {
      const extenders: Array<(e: Element) => void> = element.getAttributeNames()
                                                            .map(name => {
                                                             const e = fromDict(all, name);
                                                             if (e) {
                                                               return e.extender;
                                                             }
                                                             return null;
                                                             })
                                                            .filter(e => e !== null) as any;
      extenders.forEach(e => e(element));
    }

  };
  return {
    create
  } as any;
}
