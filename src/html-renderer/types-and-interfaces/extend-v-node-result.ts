import { Observable } from 'rxjs';
import { VNode } from 'snabbdom/vnode';
import { Dict, NullableValue } from '../../core';

export interface ExtendVNodeResult {
    content?: Observable<VNode>;
    destroy: () => void;
    propertyChange: (props: Dict<NullableValue>) => void;
  }
