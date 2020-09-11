import { Node, Value } from '../../../core';
import { GetActionListener } from './get-action-listener';

export interface ViewScope {
  node: Node<Value>;
  getActionListener: GetActionListener;
  getContent: () => ChildNode[];
}
