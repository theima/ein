import { VNode } from 'snabbdom/vnode';
import { ExtendableVNode } from '../types-and-interfaces/v-node/extendable-v-node';
import { Element } from '../../view';
import { h } from 'snabbdom';

export function createVNode(element: Element, data: {}, children: Array<string | VNode>): ExtendableVNode {
  const vNode: ExtendableVNode = h(element.name, data, children) as any;
  vNode.extendable = true;
  vNode.properties = element.properties;
  return vNode;
}
