import { Module } from 'snabbdom/modules/module';
import { VNode } from 'snabbdom/vnode';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { ExtendedVNode } from '../types-and-interfaces/v-node/extended-v-node';
import { Property } from '../../view/types-and-interfaces/property';
import { getProperty } from '../../view';
import { partial } from '../../core';
import { ExtendableVNode } from '../types-and-interfaces/v-node/extendable-v-node';

export function extenderModule(extenders: ExtenderDescriptor[]): Module {
  const create = (emptyVNode: VNode, vNode: ExtendableVNode) => {
    const element: Element = vNode.elm as any;
    if (element) {
      const applied: ExtenderDescriptor[] = extenders.filter(ext => element.hasAttribute(ext.name));
      let oldProperties: Property[] | null = null;
      if (applied.length) {
        const results = applied.map(e => e.initiateExtender(element));
        const updates = results.map(r => r.update);
        const destroys = results.map(r => {
          return r.onBeforeDestroy || (() => { });
        });
        const propertiesChanged = (newProperties: Property[]) => {
          updates.forEach((update, index) => {
            const getPropertyForExtender = partial(getProperty, applied[index].name);
            const newProperty = getPropertyForExtender(newProperties as any) as any;
            const newValue = newProperty.value;
            let oldValue;
            if (oldProperties) {
              const oldAttribute = getPropertyForExtender(oldProperties as any);
              if (oldAttribute) {
                oldValue = oldAttribute.value;
              }
            }
            update(newValue, oldValue, newProperties);
          });
          oldProperties = newProperties;
        };
        (vNode as ExtendedVNode).propertiesChanged = propertiesChanged;
        propertiesChanged(vNode.properties);
        (vNode as ExtendedVNode).destroy = () => {
          destroys.forEach(d => d());
        };
      }
    }

  };
  return {
    create
  } as any;
}
