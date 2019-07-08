import { ExtendedVNode } from './extended-v-node';
import { InitiateComponent } from './initiate-component';

export interface ComponentVNode extends ExtendedVNode {
  initiate: InitiateComponent;
}
