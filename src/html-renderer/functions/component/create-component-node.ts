import { Dict, NullableValue, withMixins } from '../../../core';
import { asyncMixin } from '../../../node-async';
import { disposableMixin } from '../../../node-disposable/disposable.mixin';
import { ComponentNode } from '../../types-and-interfaces/component-node';
import { componentNodeActionMap } from './component-node.action-map';

export function createComponentNode(initialModel: Dict<NullableValue>): ComponentNode<Dict<NullableValue>> {
  return withMixins(asyncMixin as any, disposableMixin as any).create(componentNodeActionMap as any, initialModel) as any;
}
