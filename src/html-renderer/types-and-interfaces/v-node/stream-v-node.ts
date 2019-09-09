import { VNode } from 'snabbdom/vnode';
import { Observable } from 'rxjs';
import { ExtendableVNode } from './extendable-v-node';

export interface StreamVNode extends ExtendableVNode {
  contentStream: Observable<VNode>;
}
