import { Observable } from 'rxjs';
import { VNode } from 'snabbdom/vnode';
import { Property } from '../../view/types-and-interfaces/property';

export interface ExtendVNodeResult {
    content?: Observable<VNode>;
    destroy: () => void;
    propertyChange: (props: Property[]) => void;
  }
