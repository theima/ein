import { create, Dict, NullableValue } from '../../../core';
import { asyncMixin } from '../../../node-async';
import { ComponentNode } from '../../types-and-interfaces/component-node';
import { componentNodeReducer } from './component-node.action-map';

export function createComponentNode(initialModel: Dict<NullableValue>): ComponentNode<Dict<NullableValue>> {
  return create(initialModel, componentNodeReducer as any, [asyncMixin]) as any;
}
