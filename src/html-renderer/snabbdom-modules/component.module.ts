import { Module } from 'snabbdom/modules/module';
import { ComponentDescriptor } from '../types-and-interfaces/component.descriptor';
import { VNode } from 'snabbdom/vnode';
import { ExtendedVNode } from '../types-and-interfaces/v-node/extended-v-node';
import { Property } from '../../view/types-and-interfaces/property';
import { InitiateComponentResult } from '../types-and-interfaces/initiate-component-result';
import { Dict, Value, Action, withMixins, ActionMap } from '../../core';
import { arrayToKeyValueDict } from '../../core/functions/array-to-key-value-dict';
import { StreamVNode } from '../types-and-interfaces/v-node/stream-v-node';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NodeAsync, asyncMixin } from '../../node-async';
import { isExtendableVNode } from '../functions/type-guards/is-extendable-v-node';

export function componentModule(getComponent: (name: string) => ComponentDescriptor | null): Module {
  const createVNode = (emptyVNode: VNode, vNode: VNode) => {
    if (!isExtendableVNode(vNode)) {
      return;
    }
    const element: Element = vNode.elm as any;
    if (element) {
      const component: ComponentDescriptor | null = getComponent(element.tagName.toLowerCase());
      if (component) {
        const result: InitiateComponentResult = component.init(element, null as any, null as any);
        const actionMap: ActionMap<any> = (m: Dict<Value | null>, a: Action) => {
          // tslint:disable-next-line: no-console
          console.log('component got action', a);
          return a.properties || m;
        };

        const node: NodeAsync<Dict<Value | null>> = withMixins(asyncMixin as any).create(actionMap, {}) as any;
        let oldProperties: Property[] | undefined;
        (vNode as ExtendedVNode).executeExtend = (newProperties: Property[]) => {
          // tslint:disable-next-line: no-console
          console.log('components execute');
          if (oldProperties === undefined) {
            oldProperties = [];
            const propDict: Dict<Value | null> = arrayToKeyValueDict('name', 'value', newProperties);
            const updateAction: Action = {
              type: 'ComponentPropertyUpdate',
              properties: propDict
            };
            node.next(updateAction);
          }

        };
        const obs: Observable<Dict<Value | null>> = node as any;

        const elementMap = component.createMap(node, vNode.key ? vNode.key + '': '');
        const contentStream = obs.pipe(map(elementMap));
        node.subscribe(() => {
          // tslint:disable-next-line: no-console
          console.log('component node update');
        });
        (vNode as StreamVNode).contentStream = contentStream;
        (vNode as ExtendedVNode).destroy = () => {
          if (result.onBeforeDestroy) {
            result.onBeforeDestroy();
          }
        };
      }
    }

  };
  return {
    create: createVNode
  } as any;
}
