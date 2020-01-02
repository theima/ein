import { Dict, NullableValue, withMixins } from '../../../core';
import { asyncMixin, NodeAsync } from '../../../node-async';
import { componentNodeActionMap } from './component-node.action-map';

export function createComponentNode(initialModel: Dict<NullableValue>): NodeAsync<Dict<NullableValue>> {
  return withMixins(asyncMixin as any).create(componentNodeActionMap as any, initialModel) as any;
}
