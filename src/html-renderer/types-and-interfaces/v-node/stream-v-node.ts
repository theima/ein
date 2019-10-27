import { Observable } from 'rxjs';
import { VNode } from 'snabbdom/vnode';

export interface StreamVNode extends VNode {
  contentStream: Observable<VNode>;
}
