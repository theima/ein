import { Observable, Subscription } from 'rxjs';
import { VNode } from 'snabbdom/vnode';
import { Patch } from '../types-and-interfaces/patch';

export function snabbdomRenderer(patch: Patch, root: HTMLElement | VNode, stream: Observable<VNode>): Subscription {
  return stream.subscribe(
    (n) => {
      root = patch(root, n);
    }
  );
}
