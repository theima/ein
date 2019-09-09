import { Observable } from 'rxjs';
import { VNode } from 'snabbdom/vnode';
import { Patch } from '../types-and-interfaces/patch';

export function snabbdomRenderer(patch: Patch, root: HTMLElement | VNode, stream: Observable<VNode>): void {
  stream.subscribe(
    n => {
      // tslint:disable-next-line: no-console
      console.log('will patch', root);
      root = patch(root, n);
      // tslint:disable-next-line: no-console
      console.log('patching with', n);
      // tslint:disable-next-line: no-console
      console.log('result', root);
    }
  );
}
