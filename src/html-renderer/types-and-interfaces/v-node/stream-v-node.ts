import { VNode } from 'snabbdom/vnode';
import { Observable } from 'rxjs';

export interface StreamVNode extends VNode {
  contentStream: Observable<VNode>;
}
