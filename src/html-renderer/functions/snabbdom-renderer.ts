import { Observable } from 'rxjs';
import { VNode } from 'snabbdom/vnode';
import { Patch } from '../types-and-interfaces/patch';

export function snabbdomRenderer(patch: Patch, root: HTMLElement | VNode, stream: Observable<VNode>): void {
  stream.subscribe(
    n => {
      root = patch(root, n);
    }
  );
}
