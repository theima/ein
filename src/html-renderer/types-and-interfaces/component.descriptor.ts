import { InitiateComponent } from './initiate-component';
import { VNode } from 'snabbdom/vnode';
import { Dict, Value } from '../../core';
import { NodeAsync } from '../../node-async';

export interface ComponentDescriptor {
  name: string;
  init: InitiateComponent;
  createMap: (node: NodeAsync<Dict<Value | null>>, elementId: string) => (properties: Dict<Value | null>) => VNode;
}
