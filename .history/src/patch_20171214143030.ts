import {h, init} from 'snabbdom';
import * as classModule from 'snabbdom/modules/class';
import { VNode } from 'snabbdom/vnode';
export const patch: (oldVnode:Element | VNode, vnode: VNode) => VNode = init([
    classModule.default
  ]);
