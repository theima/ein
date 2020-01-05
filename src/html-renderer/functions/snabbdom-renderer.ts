import { Observable } from 'rxjs';
import { VNode } from 'snabbdom/vnode';
import { Patch } from '../types-and-interfaces/patch';
import { isVNode } from './type-guards/is-v-node';

export function snabbdomRenderer(patch: Patch, root: HTMLElement | VNode, stream: Observable<VNode>, isContentUpdate: boolean): void {
  stream.subscribe(
    (n) => {
      // Copying attrs here because it will be cumbersome to handle through snabbdoms hooks/module.
      if (isContentUpdate && isVNode(root)) {
        n.data!.attrs = root.data!.attrs;
      }
      root = patch(root, n);
    });
}
