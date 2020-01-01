import { Observable } from 'rxjs';
import { VNode } from 'snabbdom/vnode';
import { EinVNode } from './ein-v-node';

export interface StreamVNode extends EinVNode {
  contentStream: Observable<VNode>;
}
