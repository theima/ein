import { Value } from '../../core';
import { NodeAsync } from '../../node-async';
import { GetEventListener } from './get-event-listener';

export interface ViewScope {
  node: NodeAsync<Value>;
  getEventListener: GetEventListener;
  getContent: () => ChildNode[];
}
