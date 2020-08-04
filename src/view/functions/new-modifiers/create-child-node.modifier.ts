import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';

export function createChildNodeModifier(next: ElementTemplateToDynamicNode) {
  return (template: ElementTemplate, node: NodeAsync<Value>) => {
    const childNode: NodeAsync<Value> = node;
    // lägg in från gammal modifier.
    const result = next(template, childNode);
    return result;
  };
}
