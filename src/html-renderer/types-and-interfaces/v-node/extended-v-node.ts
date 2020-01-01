import { Observable } from 'rxjs';
import { VNode } from 'snabbdom/vnode';
import { Property } from '../../../view/types-and-interfaces/property';
import { EinVNode } from './ein-v-node';

export interface ExtendedVNode extends EinVNode {
  init: (element: Element) => {
    content?: Observable<VNode>
    destroy: () => void;
    propertyChange: (props: Property[]) => void;
  };
}
