import { Node, Value } from '../../../core';
import { GetActionListener } from './get-action-listener';

export interface ViewScope {
  node: Node<Value>;
  getActionListener: GetActionListener;
  handleContent: (elementAdder:(element:ChildNode) => void) => void;
}
