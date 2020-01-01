import { Observable } from 'rxjs';
import { VNode } from 'snabbdom/vnode';

export interface ExtendedVNode extends VNode {
  init: ((element: Element) => Observable<VNode>) | ((element: Element) => void);
  destroy: () => void;
}
