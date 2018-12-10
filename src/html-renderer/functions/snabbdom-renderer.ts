import { Observable } from 'rxjs';
import { VNode } from 'snabbdom/vnode';
import { patch } from './patch';

export function snabbdomRenderer(root: HTMLElement | VNode, stream: Observable<VNode>): void {
  stream.subscribe(
    n => {
      root = patch(root, n);
    }
  );
}
