import { init } from 'snabbdom';
import * as eventModule from 'snabbdom/modules/eventlisteners';
import * as attributesModule from 'snabbdom/modules/attributes';
import { VNode } from 'snabbdom/vnode';

export const patch: (oldVnode: Element | VNode, vnode: VNode) => VNode = init([
  eventModule.default,
  attributesModule.default
]);
