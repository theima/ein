import { VNode } from 'snabbdom/vnode';
import { Dict, NullableValue } from '../../core';
import { EinVNode } from '../types-and-interfaces/v-node/ein-v-node';

export function mutateWithProperties(vNode: VNode, properties: Dict<NullableValue>): void {
  const p = vNode as EinVNode;
  p.properties = properties;
}
