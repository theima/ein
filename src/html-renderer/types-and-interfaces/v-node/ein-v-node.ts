import { VNode } from 'snabbdom/vnode';
import { Dict, NullableValue } from '../../../core';

export interface EinVNode extends VNode {
  properties: Dict<NullableValue>;
}
