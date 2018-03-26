import { Observable } from 'rxjs/Observable';
import { RenderInfo } from '../../view/types-and-interfaces/render-info';
import { VNode } from 'snabbdom/vnode';
import { renderInfoToVNode } from './render-info-to-v-node';
import { patch } from './patch';

export function snabbdomRenderer(target: HTMLElement, stream: Observable<RenderInfo>): void {
  let root: Element | VNode = target;
  stream.map(renderInfoToVNode).subscribe(
    n => {
      root = patch(root, n);
    }
  );
}
