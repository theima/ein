import { Observable } from 'rxjs';
import { Element } from '../../view';
import { snabbdomRenderer } from './snabbdom-renderer';
import { VNode } from 'snabbdom/vnode';
import { createElementToVnode } from './create-element-to-v-node';
import { map } from 'rxjs/operators';

export function HTMLRenderer(target: HTMLElement, stream: Observable<Element>): void {
  const toVnode: (element: Element) => VNode = createElementToVnode();
  snabbdomRenderer(target, stream.pipe(map(toVnode)));
}
