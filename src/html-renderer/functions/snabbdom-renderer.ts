import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Element } from '../../view/types-and-interfaces/element';
import { VNode } from 'snabbdom/vnode';
import { elementToVNode } from './element-to-v-node';
import { patch } from './patch';

export function snabbdomRenderer(target: HTMLElement, stream: Observable<Element>): void {
  let root: HTMLElement | VNode = target;
  stream.pipe(map(elementToVNode)).subscribe(
    n => {
      root = patch(root, n);
    }
  );
}
