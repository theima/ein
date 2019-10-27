import { VNode } from 'snabbdom/vnode';
import { StreamVNode } from '../../types-and-interfaces/v-node/stream-v-node';

export function isStreamVNode(node: VNode): node is StreamVNode {
  return !!(node as StreamVNode).contentStream;
}
