import { Patch } from '../types-and-interfaces/patch';
import { VNode } from 'snabbdom/vnode';
import { Observable } from 'rxjs';
import { snabbdomRenderer } from './snabbdom-renderer';

export function initiateVNodeChildStream(patch: Patch, node: VNode, stream: Observable<VNode>) {
  snabbdomRenderer(patch, node, stream);
}
