import { Observable } from 'rxjs';
import { VNode } from 'snabbdom/vnode';
import { patch } from './patch';

export function snabbdomRenderer(root: HTMLElement | VNode, stream: Observable<VNode>): void {
  stream.subscribe(
    n => {
      //tslint:disable-next-line
      console.log('patching', root);
      root = patch(root, n);
    }
  );
}
