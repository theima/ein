import { Observable } from 'rxjs';
import { VNode, VNodeData } from 'snabbdom/vnode';
import { Dict, NullableValue } from '../../core';

export interface EinVNodeData extends VNodeData {
  key: string;
  properties: Dict<NullableValue>;
  contentStream?: Observable<VNode>;
}
