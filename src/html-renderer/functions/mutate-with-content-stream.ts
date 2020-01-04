import { Observable } from 'rxjs';
import { VNode } from 'snabbdom/vnode';
import { StreamVNode } from '../types-and-interfaces/v-node/stream-v-node';

export function mutateWithContentStream(vNode: VNode, contentStream: Observable<VNode>): void {
  const extended = vNode as StreamVNode;
  extended.contentStream = contentStream;
}
