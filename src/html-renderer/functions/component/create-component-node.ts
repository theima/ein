import { create, Dict, NullableValue } from '../../../core';
import { asyncMixin } from '../../../node-async';
import { ComponentNode } from '../../types-and-interfaces/component-node';
import { componentNodeActionMap } from './component-node.action-map';

export function createComponentNode(initialModel: Dict<NullableValue>): ComponentNode<Dict<NullableValue>> {
  return create(componentNodeActionMap as any, initialModel, [asyncMixin]) as any;
}
