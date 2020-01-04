import { NodeBehaviorSubject, NodeConstructor } from '../core';

export function disposableMixin<T, NBase extends NodeConstructor<NodeBehaviorSubject<T>>>(node: NBase): NBase {
  return class extends node {
   public dispose() {
     super.dispose();
   }
  };
}
