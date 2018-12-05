import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Element } from '../../view/types-and-interfaces/element';
import { VNode } from 'snabbdom/vnode';
import { createElementToVnode } from './create-element-to-v-node';
import { patch } from './patch';

export function snabbdomRenderer(target: HTMLElement, stream: Observable<Element>): void {
  let root: HTMLElement | VNode = target;
  const toVnode: (element: Element) => VNode = createElementToVnode();

  stream.pipe(map(toVnode)).subscribe(
    n => {
      root = patch(root, n);
    }
  );
}
