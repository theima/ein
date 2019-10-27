import { ExtendedVNode } from './v-node/extended-v-node';
import { InitiateComponent } from './initiate-component';

export interface ComponentVNode extends ExtendedVNode {
  initiate: InitiateComponent;
}
