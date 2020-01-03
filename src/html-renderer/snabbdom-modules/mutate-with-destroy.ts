import { VNode } from 'snabbdom/vnode';
import { DestroyVNode } from '../types-and-interfaces/v-node/destroy-v-node';

export function mutateWithDestroy(vNode: VNode, destroy: () => void): void {
  const destroyVnode: DestroyVNode = vNode as any;
  if ((vNode as any).destroy) {
    const old = (vNode as any).destroy;
    destroyVnode.destroy = () => {
      old();
      destroy();
    };
  } else {
    destroyVnode.destroy = destroy;
  }

}
