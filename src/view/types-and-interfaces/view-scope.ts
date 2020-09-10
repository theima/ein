import { Node, Value } from '../../core';
import { GetEventListener } from './get-event-listener';

export interface ViewScope {
  node: Node<Value>;
  getEventListener: GetEventListener;
  getContent: () => ChildNode[];
}
